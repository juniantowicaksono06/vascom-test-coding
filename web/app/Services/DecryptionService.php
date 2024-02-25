<?php

namespace App\Services;

class DecryptionService
{
    public static function sha1($input) {
        return sha1($input, true); // Use raw binary output
    }
    
    public static function password_derive_bytes($password, $salt, $iterations, $len) {
        $key = $password . $salt;
        for ($i = 0; $i < $iterations; $i++) {
            $key = self::sha1($key); // Use raw binary output
        }
        if (strlen($key) < $len) {
            $hx = self::password_derive_bytes($password, $salt, $iterations - 1, 20);
            for ($counter = 1; strlen($key) < $len; $counter++) {
                $key = $key . self::sha1($counter . $hx); // Concatenate raw binary output
            }
        }
        return str_pad($key, $len, "\0", STR_PAD_RIGHT); // Ensure output length
    }
    public static function decrypt($encryptedData)
    {
        $iv = env('IV');
        $decryptedText = openssl_decrypt(
            $encryptedData,
            'aes-256-cbc',
            self::password_derive_bytes(env('SECRET_KEY'), '', 100, 32),
            OPENSSL_RAW_DATA,
            $iv
        );

        return $decryptedText;
    }
}
