<?php
/**
 * Gets the most recent label changes, run after a "labeled" event in a Pull Request.
 */
$issue = $argv[0];
$token = $argv[1] ?? null;

// Get timeline of events
$timeline = json_decode(
    file_get_contents('https://api.github.com/repos/octobercms/october/issues/' . $issue . '/timeline')
);
$timeline = array_reverse($timeline);

$labelsAdded = [];
$labelsRemoved = [];

foreach ($timeline as $event) {
    if (!in_array($event['event'], ['labeled', 'unlabeled'])) {
        break;
    }

    if ($event['event'] === 'labeled') {
        $labelsAdded[] = $event['label']['name'];
    } else {
        $labelsRemoved[] = $event['label']['name'];
    }
}

if (!count($labelsAdded) && !count($labelsRemoved)) {
    //echo 'No labels added to '
}

$labelsAdded = array_diff($labelsAdded, $labelsRemoved);
