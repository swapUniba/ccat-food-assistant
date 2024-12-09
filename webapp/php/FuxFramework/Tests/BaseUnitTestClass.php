<?php

namespace Fux\Tests;

class BaseUnitTestClass
{

    public function run($outputFailures = false)
    {
        $methods = get_class_methods($this);
        $success = [];
        $failures = [];
        $failuresTraces = [];
        $totalTests = 0;
        $sectionPadding = "20px";

        foreach ($methods as $method) {
            if (str_starts_with($method, "test")) {
                $totalTests++;
                try {
                    $this->$method();
                    $success[] = $method;
                } catch (\AssertionError $e) {
                    $failures[] = $method;
                    if ($outputFailures) {
                        $failuresTraces[] = $e->getMessage() . "<br/>" . $e->getTraceAsString();
                    }
                }
            }
        }

        $classColor = count($success) >= $totalTests ? "green" : (count($failures) >= $totalTests ? "red" : "orange");
        echo str_repeat("_", 80) . "<br/>";
        echo "<b style='color:$classColor;'>" . static::class . "</b><br/>";
        echo "Success: " . count($success) . "/$totalTests<br/>";
        if ($failures) {
            echo "Failures: " . count($failures) . "/$totalTests<br/>";
            if ($outputFailures) {
                echo "<div style='padding-left:$sectionPadding;'>";
                echo "Failures details:<br/>";
                foreach ($failuresTraces as $i => $trace) {
                    echo "<b>Method: " . $failures[$i] . "</b><br/>";
                    echo "<div style='padding-left:$sectionPadding;'>";
                    echo $trace;
                    echo "</div>";
                }
                echo "</div>";
            }
        }
        echo str_repeat("_", 80) . "<br/>";
    }

}
