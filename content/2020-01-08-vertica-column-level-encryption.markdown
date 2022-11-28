Title: Column level encryption on a Vertica Database
Author: Andy Reagan
Category: Programming
Tags: vertica, security
Date: 2020-01-08

Vertica is a very powerful analytics database,
and security is important!
You might need to store sensitive data,
like SSN,
but you don't want the SSNs available to anyone who can see the table on the database.
To provide an additional layer of security,
we can encrypt the SSN itself and store the encrypted data.

We can easily extend Vertica functionality now by building in Python functions,
so we'll do this in Python.
To get set up developing with Python for Vertica,
see my [previous post](https://andyreagan.github.io/2019/07/05/developing-python-on-vertica/).

There are many different algorithms around,
here we'll choose RSA.
If you're not familiar with RSA,
all you really need to know is that there are two keys:
(1) used to encrypt data (in RSA parlance, the public key)
and (2) use to decrypt the data (the private key).
The cryptography relies on a hard problem one way (factoring a multiple of two large primes),
that is very easy the other way (creating that number if you have both primes: you just multiply).

Example: we have SSN data `111-22-3333`.
Using an encryption key of `30820122300d0...` (it's 512 characters of this),
we'll turn `111-22-3333` into a long string of letters and numbers.
We could use the decryption key on that long string to get back the original SSN.

## Create the encryption script in Python

Using the `pycrypto` library, here's how we can construct a simple encryption script:

```
# encrypt_lambda.py

from Crypto.PublicKey import RSA
import binascii
import sys

key = RSA.generate(2048)
binPrivKey = key.exportKey('DER')
binPubKey =  key.publickey().exportKey('DER')


def bin2hex(binStr):
    return binascii.hexlify(binStr)


def hex2bin(hexStr):
    return binascii.unhexlify(hexStr)


x = lambda key, s: bin2hex(RSA.importKey(hex2bin(key)).encrypt(s.encode('utf8'), 10)[0]).decode('utf8')


def main():
    print(x(sys.argv[1], sys.argv[2]))


if __name__ == '__main__':
    main()
```

We can test this by first installing `pycrypto`, then:

```
python3 encrypt_lambda.py 30820122300d06092a864886f70d01010105000382010f003082010a0282010100df91d2e51370d260a25dbc0121ce0c999f0a0896f8e44c04b6d331be91fa74a7c51bf4c7dfa49835a18116520a685d6e314dfbd047dcdf999ffcfda3770dfb24776a0dda94d6795c517c9c304a3da893a837371811a64f66bcb743d40fbb2aba4701c5f4a536b740773d672db5ec48a538cda7bebda8dc3161a14cb26e371fb9eacf5f50cf7626d5d84daf7a34d3b2bdab336d89ff640afaced9c29aa86007b7da10db05c0298e84f4662663941dbe8bbe6a18732bb0ee4af1ac561b0e47f2beefe22a4179bada94d3fb154b4cfeca29eef5b8bf1198cd11167918de5cf3c2e30c2eabdee953f6d49804f441d29a9cbaa4553c08711afe14d624a200a2b30d8d0203010001 111223333
6d0eb35fd82302731c5649773b873e3a714c14af356f8dba6b07fc8ba3c1aa9fcd9b041dfb4c359574433bc0d38a14ab12f211ad1a2ef069a791b6dee006405af9e97f1012abf0458f2ae7f4557278bce4444c2a86491d304dedf63f4328ff14e53232bd64c4174a85cb9b52d00f285df80328686c10b67634424984f47d23803ceef9ddae1ab782b4816bb935e0cf28ae2dc9e76453610a3d62a0b6261703e8f6fa8100f310758a472331b8cb76024a59f93b887a8a3f9b6e4ddbcc650f8d42c2ef17f09209e7d2d007c9688a538052520c9578c5e70c7ef0479490d27f250e2915afb1e08674587bf63679651cc67ee973593f51f5d4157644d3a8ab9f14eb
```


For Vertica, we have to create the sdk classes,
name this one `rsa.py`:

```
# rsa.py
from Crypto.PublicKey import RSA
import binascii
import vertica_sdk


def bin2hex(binStr):
    return binascii.hexlify(binStr)


def hex2bin(hexStr):
    return binascii.unhexlify(hexStr)


class encrypt(vertica_sdk.ScalarFunction):
    """
    Very simple scalar function which adds its two integer inputs
    """
    def processBlock(self, server_interface, arg_reader, res_writer):
        server_interface.log("Hello! python_udxes_are_great")
        while True:
            key = arg_reader.getString(0)
            # get the second argument
            arg = arg_reader.getString(1)
            y = bin2hex(RSA.importKey(hex2bin(key)).encrypt(arg.encode('utf8'), 10)[0]).decode('utf8')
            res_writer.setString(y)
            res_writer.next()
            if not arg_reader.next():
                break


class encrypt_factory(vertica_sdk.ScalarFunctionFactory):
    def getPrototype(self, srv_interface, arg_types, return_type):
        arg_types.addVarchar()
        # add a second argument
        arg_types.addVarchar()
        return_type.addVarchar()
        def getReturnType(self, srv_interface, arg_types, return_type):
            return_type.addVarchar(512)
        def createScalarFunction(self, srv):
            return encrypt()
```

## Deploy it on Vertica

Then we create the function on Vertica, using the SDK-friendly script above.


```
\set libfile '\''`pwd`'/rsa.py\''
DROP LIBRARY rsalib CASCADE;
CREATE LIBRARY rsalib AS :libfile DEPENDS '/home/dbadmin/local/lib/python3.5/site-packages/' LANGUAGE 'Python';

-- Step 2: Create functions
CREATE FUNCTION encrypt AS NAME 'encrypt_factory' LIBRARY rsalib;
```

We can test the function directly:

```
select encrypt('30820122300d06092a864886f70d01010105000382010f003082010a0282010100df91d2e51370d260a25dbc0121ce0c999f0a0896f8e44c04b6d331be91fa74a7c51bf4c7dfa49835a18116520a685d6e314dfbd047dcdf999ffcfda3770dfb24776a0dda94d6795c517c9c304a3da893a837371811a64f66bcb743d40fbb2aba4701c5f4a536b740773d672db5ec48a538cda7bebda8dc3161a14cb26e371fb9eacf5f50cf7626d5d84daf7a34d3b2bdab336d89ff640afaced9c29aa86007b7da10db05c0298e84f4662663941dbe8bbe6a18732bb0ee4af1ac561b0e47f2beefe22a4179bada94d3fb154b4cfeca29eef5b8bf1198cd11167918de5cf3c2e30c2eabdee953f6d49804f441d29a9cbaa4553c08711afe14d624a200a2b30d8d0203010001', '111-53-8888');
```

You can also store keys in a table:

```
create table public_keys (name varchar(80), key varchar(1024));
insert into public_keys (name, key) (select 'andys key', '30820122300d06092a864886f70d01010105000382010f003082010a0282010100df91d2e51370d260a25dbc0121ce0c999f0a0896f8e44c04b6d331be91fa74a7c51bf4c7dfa49835a18116520a685d6e314dfbd047dcdf999ffcfda3770dfb24776a0dda94d6795c517c9c304a3da893a837371811a64f66bcb743d40fbb2aba4701c5f4a536b740773d672db5ec48a538cda7bebda8dc3161a14cb26e371fb9eacf5f50cf7626d5d84daf7a34d3b2bdab336d89ff640afaced9c29aa86007b7da10db05c0298e84f4662663941dbe8bbe6a18732bb0ee4af1ac561b0e47f2beefe22a4179bada94d3fb154b4cfeca29eef5b8bf1198cd11167918de5cf3c2e30c2eabdee953f6d49804f441d29a9cbaa4553c08711afe14d624a200a2b30d8d0203010001');
select encrypt(pk.key, secrets.ssn) as encrypted_ssn from (select '111-53-8888' as ssn) secrets full outer join public_keys pk on pk.name = 'andys key';
```

Now we can sleep better knowing that the data is just a little bit safer!

I'll leave the decryption up to you,
it should be simple now ;)
