<?php

namespace PHPMailer\PHPMailer;

/**
 * PHPMailer RFC821 SMTP email transport class.
 * Simplified version for inclusion in the project.
 */
class SMTP
{
    const VERSION = '6.8.1';
    const CRLF = "\r\n";
    const DEFAULT_SMTP_PORT = 25;
    const MAX_LINE_LENGTH = 998;
    const DEBUG_OFF = 0;
    const DEBUG_CLIENT = 1;
    const DEBUG_SERVER = 2;
    const DEBUG_CONNECTION = 3;
    const DEBUG_LOWLEVEL = 4;

    /**
     * SMTP connection
     */
    protected $smtp_conn;
    protected $error = ['error' => '', 'detail' => ''];
    protected $helo_rply;
    protected $server_caps;
    protected $last_reply = '';

    /**
     * Connect to an SMTP server
     */
    public function connect($host, $port = null, $timeout = 30, $options = [])
    {
        // Set connect timeout
        $errno = 0;
        $errstr = '';
        if (is_null($port)) {
            $port = self::DEFAULT_SMTP_PORT;
        }
        $this->smtp_conn = @fsockopen(
            $host,
            $port,
            $errno,
            $errstr,
            $timeout
        );
        if (empty($this->smtp_conn)) {
            $this->error = [
                'error' => 'Failed to connect to server',
                'detail' => $errstr . ' (' . $errno . ')',
            ];
            return false;
        }
        return true;
    }

    /**
     * Sends a command to the connected server
     */
    public function sendCommand($command, $commandstring, $expect = 250)
    {
        $this->last_reply = '';
        fwrite($this->smtp_conn, $command . ' ' . $commandstring . self::CRLF);
        $reply = $this->getLines();
        $code = substr($reply, 0, 3);
        return $code == $expect;
    }

    /**
     * Get the server response
     */
    protected function getLines()
    {
        $data = '';
        $line = fgets($this->smtp_conn, 515);
        $data .= $line;
        $this->last_reply = $data;
        return $data;
    }

    /**
     * Authenticate using an SMTP service
     */
    public function authenticate($username, $password, $authtype = 'LOGIN')
    {
        if (!$this->sendCommand('AUTH', $authtype)) {
            return false;
        }
        
        if ($authtype == 'LOGIN') {
            if (!$this->sendCommand('', base64_encode($username))) {
                return false;
            }
            if (!$this->sendCommand('', base64_encode($password))) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Send the MAIL FROM command
     */
    public function mail($from)
    {
        return $this->sendCommand('MAIL FROM', '<' . $from . '>');
    }

    /**
     * Send the RCPT TO command
     */
    public function recipient($address)
    {
        return $this->sendCommand('RCPT TO', '<' . $address . '>');
    }

    /**
     * Send the DATA command
     */
    public function data($msg_data)
    {
        if (!$this->sendCommand('DATA', 'DATA', 354)) {
            return false;
        }
        
        fwrite($this->smtp_conn, $msg_data . self::CRLF . '.' . self::CRLF);
        return $this->getLines();
    }

    /**
     * Send the QUIT command
     */
    public function quit()
    {
        return $this->sendCommand('QUIT', 'QUIT');
    }

    /**
     * Close the socket and clean up
     */
    public function close()
    {
        if (is_resource($this->smtp_conn)) {
            fclose($this->smtp_conn);
            $this->smtp_conn = null;
        }
    }
} 