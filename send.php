<?
    $data = json_decode($_GET['data']);

    $to  = "<prevetal@gmail.com>";

    $subject = "ISDK Portfolio - Feedback";

    $message = "Услуга: " . $data->service . "<br>";
    $message .= "E-mail: " . $data->email . "<br>";
    $message .= "Текст сообщения: " . $data->text . "<br>";

    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .= "Reply-To: ". $data->email ."\r\n";

    mail($to, $subject, $message, $headers);

    echo 1;
?>