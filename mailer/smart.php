<?php // предупреждение серверу, что будет запускатся файл php

//переменные, получение инпутов по атрибуту name
$name = $_POST['name'];
$textArea = $_POST['text'];
$email = $_POST['email'];


require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

// $mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = '';                 // Наш логин
$mail->Password = '';                           // Наш пароль от ящика
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to
 
$mail->setFrom('', 'Portfolio');   // От кого письмо    
$mail->addAddress('');     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Данные';
$mail->Body    = '
<style>.title,.opt{margin:0;line-height:1;}.title{font-size: 18px;font-weight: 700;}.opt{font-size: 16px;}.opt span{font-weight: 700;}</style>
<p class="title">Пользователь оставил данные</p> <br> 
<p class="opt"><span>Имя:</span> ' . $name . '</p> <br>
<p class="opt"><span>E-mail:</span> ' . $email . '</p> <br>
<p class="opt"><span>Сообщение:</span> ' . $textArea . '</p>
';

if(!$mail->send()) {
    return false;
} else {
    return true;
}

?>



          