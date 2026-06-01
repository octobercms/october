<?php

use Backend\Models\User;
use Carbon\Carbon;

/**
 * BackendUserResetPasswordTest covers the expiration window applied to
 * backend password reset codes. A reset code is valid only while it
 * matches the stored code AND was issued within
 * backend.password_policy.reset_expire_minutes.
 */
class BackendUserResetPasswordTest extends TestCase
{
    protected function makeUserWithReset(string $code, ?Carbon $issuedAt): User
    {
        $user = new User();
        $user->reset_password_code = $code;
        $user->reset_password_at = $issuedAt;
        return $user;
    }

    public function testFreshTokenIsAccepted()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 60);
        $user = $this->makeUserWithReset('abc123', Carbon::now()->subMinutes(5));

        $this->assertTrue($user->checkResetPasswordCode('abc123'));
    }

    public function testExpiredTokenIsRejected()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 60);
        $user = $this->makeUserWithReset('abc123', Carbon::now()->subMinutes(61));

        $this->assertFalse($user->checkResetPasswordCode('abc123'));
    }

    public function testTokenAtExactlyTheExpiryIsRejected()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 60);
        $user = $this->makeUserWithReset('abc123', Carbon::now()->subMinutes(60));

        // Boundary: 60 minutes elapsed is NOT less than 60, so rejected.
        $this->assertFalse($user->checkResetPasswordCode('abc123'));
    }

    public function testTokenWithoutIssuedAtTimestampIsRejected()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 60);
        $user = $this->makeUserWithReset('abc123', null);

        // Pre-patch tokens have no timestamp and must be treated as expired.
        $this->assertFalse($user->checkResetPasswordCode('abc123'));
    }

    public function testWrongCodeStillRejectedEvenWhenFresh()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 60);
        $user = $this->makeUserWithReset('abc123', Carbon::now());

        $this->assertFalse($user->checkResetPasswordCode('wrong'));
    }

    public function testExpiryDisabledWhenConfigZero()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 0);
        $user = $this->makeUserWithReset('abc123', Carbon::now()->subDays(7));

        // With expiry disabled, the legacy behavior (code match only) applies.
        $this->assertTrue($user->checkResetPasswordCode('abc123'));
    }

    public function testExpiryDisabledIgnoresMissingTimestamp()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 0);
        $user = $this->makeUserWithReset('abc123', null);

        // With expiry disabled, the missing-timestamp rejection also lifts.
        $this->assertTrue($user->checkResetPasswordCode('abc123'));
    }

    public function testCustomExpiryWindowIsRespected()
    {
        Config::set('backend.password_policy.reset_expire_minutes', 10);
        $user = $this->makeUserWithReset('abc123', Carbon::now()->subMinutes(9));

        $this->assertTrue($user->checkResetPasswordCode('abc123'));

        $user->reset_password_at = Carbon::now()->subMinutes(11);
        $this->assertFalse($user->checkResetPasswordCode('abc123'));
    }
}
