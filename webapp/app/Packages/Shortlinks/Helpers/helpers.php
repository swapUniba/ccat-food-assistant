<?php

function merge_query_params($url, $params) {
    // Parse the URL
    $parsed_url = parse_url($url);

    // Parse the query string into an associative array
    $original_query_params = [];
    if (isset($parsed_url['query'])) {
        parse_str($parsed_url['query'], $original_query_params);
    }

    // Merge the original query parameters with the provided associative array
    $merged_params = array_merge($original_query_params, $params);

    // Reconstruct the query string
    $new_query_string = http_build_query($merged_params);

    // Reconstruct the URL with the new query string
    $new_url = $parsed_url['scheme'] . '://' . $parsed_url['host'] . (isset($parsed_url['path']) ? $parsed_url['path'] : '');
    if (!empty($new_query_string)) {
        $new_url .= '?' . $new_query_string;
    }
    if (isset($parsed_url['fragment'])) {
        $new_url .= '#' . $parsed_url['fragment'];
    }

    return $new_url;
}
