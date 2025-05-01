<?php

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer - PHP email creation and transport class.
 * Simplified version for inclusion in the project.
 */
class PHPMailer
{
    const CHARSET_ASCII = 'us-ascii';
    const CHARSET_ISO88591 = 'iso-8859-1';
    const CHARSET_UTF8 = 'utf-8';
    
    const CONTENT_TYPE_PLAINTEXT = 'text/plain';
    const CONTENT_TYPE_TEXT_HTML = 'text/html';
    const CONTENT_TYPE_MULTIPART_ALTERNATIVE = 'multipart/alternative';
    const CONTENT_TYPE_MULTIPART_MIXED = 'multipart/mixed';
    
    const ENCODING_7BIT = '7bit';
    const ENCODING_8BIT = '8bit';
    const ENCODING_BASE64 = 'base64';
    const ENCODING_QUOTED_PRINTABLE = 'quoted-printable';

    /**
     * Email priority.
     */
    public $Priority = 3;

    /**
     * Sets message type to HTML or plain.
     */
    public $isHTML = false;

    /**
     * The character set of the message.
     */
    public $CharSet = self::CHARSET_UTF8;

    /**
     * The MIME Content-type of the message.
     */
    public $ContentType = self::CONTENT_TYPE_PLAINTEXT;

    /**
     * The message encoding.
     */
    public $Encoding = self::ENCODING_8BIT;

    /**
     * Holds the most recent mailer error message.
     */
    public $ErrorInfo = '';

    /**
     * The From email address for the message.
     */
    public $From = '';

    /**
     * The From name of the message.
     */
    public $FromName = '';

    /**
     * The Subject of the message.
     */
    public $Subject = '';

    /**
     * The HTML body of the message.
     */
    public $Body = '';

    /**
     * The plain-text body of the message.
     */
    public $AltBody = '';

    /**
     * An array of all kinds of addresses.
     */
    protected $all_recipients = [];
    protected $to = [];
    protected $cc = [];
    protected $bcc = [];
    protected $ReplyTo = [];

    /**
     * SMTP-specific settings
     */
    public $Mailer = 'smtp';
    public $Host = '';
    public $Port = 25;
    public $SMTPSecure = '';
    public $SMTPAuth = false;
    public $Username = '';
    public $Password = '';

    /**
     * Constructor
     */
    public function __construct($exceptions = true)
    {
        // Nothing required
    }

    /**
     * Set the From and FromName properties
     */
    public function setFrom($address, $name = '', $auto = true)
    {
        $this->From = $address;
        $this->FromName = $name;
        return true;
    }

    /**
     * Add a "To" address
     */
    public function addAddress($address, $name = '')
    {
        $this->to[$address] = [$address, $name];
        $this->all_recipients[$address] = true;
        return true;
    }

    /**
     * Add a "Reply-To" address
     */
    public function addReplyTo($address, $name = '')
    {
        $this->ReplyTo[$address] = [$address, $name];
        return true;
    }

    /**
     * Set the subject line
     */
    public function Subject($subject)
    {
        $this->Subject = $subject;
        return true;
    }

    /**
     * Set the Body and AltBody
     */
    public function Body($body, $alt = '')
    {
        $this->Body = $body;
        $this->AltBody = $alt;
        return true;
    }

    /**
     * Use SMTP for sending
     */
    public function isSMTP()
    {
        $this->Mailer = 'smtp';
        return true;
    }

    /**
     * Send the message
     */
    public function send()
    {
        try {
            if (count($this->to) == 0) {
                throw new Exception('You must provide at least one recipient email address.');
            }
            
            if ($this->Mailer == 'smtp') {
                return $this->smtpSend();
            }
            
            throw new Exception('Mail transport not implemented');
        } catch (Exception $e) {
            $this->ErrorInfo = $e->getMessage();
            return false;
        }
        
        return true;
    }

    /**
     * Send using SMTP
     */
    protected function smtpSend()
    {
        $smtp = new SMTP();
        
        // Connect to the SMTP server
        if (!$smtp->connect($this->Host, $this->Port)) {
            throw new Exception('SMTP connect() failed.');
        }
        
        // Authenticate if needed
        if ($this->SMTPAuth && !empty($this->Username) && !empty($this->Password)) {
            if (!$smtp->authenticate($this->Username, $this->Password)) {
                throw new Exception('SMTP authenticate() failed.');
            }
        }
        
        // Set the sender
        if (!$smtp->mail($this->From)) {
            throw new Exception('SMTP mail() failed.');
        }
        
        // Send to all recipients
        foreach (array_keys($this->to) as $to) {
            if (!$smtp->recipient($to)) {
                throw new Exception('SMTP recipient() failed.');
            }
        }
        
        // Data
        $message = $this->createHeader() . $this->createBody();
        if (!$smtp->data($message)) {
            throw new Exception('SMTP data() failed.');
        }
        
        // Close connection
        $smtp->quit();
        $smtp->close();
        
        return true;
    }

    /**
     * Create message headers
     */
    protected function createHeader()
    {
        $result = '';
        
        // From
        $result .= 'From: ' . $this->FromName . ' <' . $this->From . ">\r\n";
        
        // To
        $toheader = '';
        foreach ($this->to as $toaddr) {
            $toheader .= $toaddr[1] . ' <' . $toaddr[0] . '>, ';
        }
        $result .= 'To: ' . rtrim($toheader, ', ') . "\r\n";
        
        // Reply-To
        if (!empty($this->ReplyTo)) {
            $replyTo = '';
            foreach ($this->ReplyTo as $r) {
                $replyTo .= $r[1] . ' <' . $r[0] . '>, ';
            }
            $result .= 'Reply-To: ' . rtrim($replyTo, ', ') . "\r\n";
        }
        
        // Subject
        $result .= 'Subject: ' . $this->Subject . "\r\n";
        
        // Date
        $result .= 'Date: ' . date('r') . "\r\n";
        
        // Content type
        if ($this->isHTML) {
            $result .= 'MIME-Version: 1.0' . "\r\n";
            $result .= 'Content-Type: multipart/alternative; boundary="b1_' . md5(uniqid()) . '"' . "\r\n";
        } else {
            $result .= 'Content-Type: text/plain; charset=' . $this->CharSet . "\r\n";
        }
        
        // Additional headers
        $result .= 'X-Mailer: PHPMailer' . "\r\n";
        $result .= 'X-Priority: ' . $this->Priority . "\r\n";
        
        $result .= "\r\n";
        
        return $result;
    }

    /**
     * Create message body
     */
    protected function createBody()
    {
        $result = '';
        
        if ($this->isHTML) {
            $boundary = 'b1_' . md5(uniqid());
            
            // Plain text version
            $result .= '--' . $boundary . "\r\n";
            $result .= 'Content-Type: text/plain; charset=' . $this->CharSet . "\r\n";
            $result .= 'Content-Transfer-Encoding: ' . $this->Encoding . "\r\n\r\n";
            $result .= $this->AltBody . "\r\n\r\n";
            
            // HTML version
            $result .= '--' . $boundary . "\r\n";
            $result .= 'Content-Type: text/html; charset=' . $this->CharSet . "\r\n";
            $result .= 'Content-Transfer-Encoding: ' . $this->Encoding . "\r\n\r\n";
            $result .= $this->Body . "\r\n\r\n";
            
            // Close boundary
            $result .= '--' . $boundary . '--' . "\r\n";
        } else {
            $result .= $this->Body;
        }
        
        return $result;
    }
} 