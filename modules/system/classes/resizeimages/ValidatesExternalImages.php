<?php namespace System\Classes\ResizeImages;

use October\Rain\Filesystem\Definitions as FileDefinitions;
use finfo;

/**
 * ValidatesExternalImages guards the external image fetcher against SSRF and
 * non-image sources; kept separate from the resizer's core logic
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ValidatesExternalImages
{
    /**
     * validateExternalImageUrl checks if an external URL has a valid image extension
     */
    protected function validateExternalImageUrl(string $url): bool
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (!$path) {
            return false;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!$extension) {
            return false;
        }

        return in_array($extension, FileDefinitions::get('image_extensions'));
    }

    /**
     * validateExternalImageHost rejects URLs whose scheme is not http(s) or whose
     * host resolves to a loopback, private, link-local, or reserved address
     */
    protected function validateExternalImageHost(string $url): bool
    {
        $parts = parse_url($url);
        if (!$parts || !isset($parts['scheme'], $parts['host'])) {
            return false;
        }

        if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) {
            return false;
        }

        // parse_url returns IPv6 literals wrapped in brackets, e.g. [::1]
        $host = trim($parts['host'], '[]');

        $ips = [];
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $ips[] = $host;
        }
        else {
            $records = @dns_get_record($host, DNS_A | DNS_AAAA);
            if (is_array($records)) {
                foreach ($records as $record) {
                    $ips[] = $record['ip'] ?? $record['ipv6'] ?? null;
                }
            }
        }

        $ips = array_filter($ips);
        if (empty($ips)) {
            return false;
        }

        foreach ($ips as $ip) {
            // Unwrap IPv4-mapped IPv6 so FILTER_FLAG_NO_PRIV_RANGE/NO_RES_RANGE apply to the embedded IPv4
            $normalized = $this->normalizeIpForRangeCheck($ip);
            if ($normalized === null) {
                return false;
            }

            if (!filter_var($normalized, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return false;
            }
        }

        return true;
    }

    /**
     * validateImageContents checks the fetched bytes are actually an image by MIME type
     */
    protected function validateImageContents(string $contents): bool
    {
        if (empty($contents)) {
            return false;
        }

        $mimeType = (new finfo(FILEINFO_MIME_TYPE))->buffer($contents);
        if (!$mimeType) {
            return false;
        }

        return str_starts_with($mimeType, 'image/');
    }

    /**
     * normalizeIpForRangeCheck converts IPv4-mapped and IPv4-compatible IPv6
     * addresses to their embedded IPv4 form so private-range checks apply
     */
    protected function normalizeIpForRangeCheck(string $ip): ?string
    {
        $packed = @inet_pton($ip);
        if ($packed === false) {
            return null;
        }

        if (strlen($packed) === 16) {
            // IPv4-mapped IPv6: ::ffff:a.b.c.d
            if (strncmp($packed, str_repeat("\0", 10) . "\xff\xff", 12) === 0) {
                return inet_ntop(substr($packed, 12));
            }

            // IPv4-compatible IPv6: ::a.b.c.d, but preserve :: and ::1 for the range filter
            $tail = substr($packed, 12);
            if (strncmp($packed, str_repeat("\0", 12), 12) === 0 && $tail !== "\0\0\0\0" && $tail !== "\0\0\0\1") {
                return inet_ntop($tail);
            }
        }

        return $ip;
    }
}
