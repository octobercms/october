# Benchmarks

Standalone scripts for measuring cache and request behaviour against the real
framework classes. They are not part of the test suite and are never run by
`phpunit`, so they can boot the application and take as long as they need.

Run them with the PHP CLI from anywhere, they locate the project themselves:

    php modules/cms/tests/benchmarks/component-props-bench.php --objects=500
    php modules/cms/tests/benchmarks/request-cache-profile.php --partials=20 --latency=500

Every script starts with a comment saying what it measures and which arguments
it takes, and prints its result as JSON.

## Comparing a change against its base

The scripts only use the public and protected API of the code they measure, so
the same file runs on either revision. To produce a before and after:

    git checkout <base>
    git checkout <branch> -- modules/cms/tests/benchmarks
    php modules/cms/tests/benchmarks/<script>.php <arguments>

    git reset --hard <base>
    git checkout <branch>
    php modules/cms/tests/benchmarks/<script>.php <arguments>

Use the same arguments for both runs and diff the two JSON results.

## Reading the numbers

Cache reads and writes are routed through an instrumented store that counts
every byte crossing the wire and, where the script supports it, can charge each
operation a round trip. On a shared cache such as Redis or Memcached those bytes
are serialized, transferred and parsed on every request that touches the key, and
each operation waits on the network, so payload size and operation count both
matter in a way they do not against a local array store.

Absolute timings come from a CLI process without a warm opcode cache, so they run
slower than the same work behind PHP-FPM. Compare the two runs against each
other rather than reading either as a production figure.

## A note on local state

Scripts that render a page clear the compiled Twig templates and parsed PHP under
`storage/cms`, otherwise a run inherits templates built by an earlier one. Those
directories rebuild themselves on the next request, but expect the first page
load after a run to be slower.
