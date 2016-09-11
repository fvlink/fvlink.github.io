<?php 
$file = fopen ("http://soft-men.my1.ru/uploads/newversion.js", "r");
if (!$file) {
    echo "<p>Невозможно открыть удаленный файл.\n";
    exit;
}

while (!feof ($file)) {
    $line = fgets ($file, 1024);
    /* Сработает, только если заголовок и сопутствующие теги расположены в одной строке */
    if (preg_match ("@remotelink:(.*);@i", $line, $out)) {
        $title = $out[1];
        break;
    }
}
fclose($file);

header('HTTP/1.1 200 OK');
header('Location: '.$title);
exit();

 ?>