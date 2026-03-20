<?php namespace System\Traits;

/**
 * @deprecated
 */
trait ElementRenderer
{
    /**
     * setDefaults
     */
    protected function setDefaults(): void
    {
    }

    /**
     * renderBody is a helper for dealing with mixed body types
     */
    protected function renderBody($body): string
    {
        if (is_callable($body)) {
            return (string) ($body)();
        }

        if (is_array($body)) {
            $out = '';

            foreach ($body as $el) {
                if (is_callable($el)) {
                    $out .= (string) ($el)();
                }
                else {
                    $out .= (string) $el;
                }
            }

            return $out;
        }

        return (string) $body;
    }

    /**
     * renderAsString
     */
    public function renderAsString(): string
    {
        $this->setDefaults();

        ob_start();
        $this->render()();
        return ob_get_clean();
    }

    /**
     * __toString
     */
    public function __toString()
    {
        return $this->renderAsString();
    }
}
