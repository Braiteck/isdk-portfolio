<?
    $data = json_decode($_GET['data']);

    $to  = "<prevetal@gmail.com>";

    $subject = "ISDK Portfolio - Feedback";

    $message = "Тема: " . $data->subject . "\r\n";
    $message .= "E-mail: " . $data->email . "\r\n";
    $message .= "Текст сообщения: " . $data->text . "\r\n";

    $headers  = "Content-type: text/html; charset=windows-1251 \r\n";
    $headers .= "Reply-To: ". $data->email ."\r\n";

    mail($to, $subject, $message, $headers);

    echo 1;
?>