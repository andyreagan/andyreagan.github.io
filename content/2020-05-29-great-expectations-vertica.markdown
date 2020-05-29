Title: Great Expectations of Vertica
Author: Andy Reagan
Date: 2020-05-29

First run Vertica:

    docker run -p 5433:5433 -e DATABASE_PASSWORD='foo123' jbfavre/vertica:9.2.0-7_debian-8 

Confirm that you can connect to it, and create a schema called npi_data:

    echo 'create schema npi_data' | vsql -p 5433 -h localhost -U dbadmin -d docker -w foo123

Now, GE uses Sqlachemy, so let's get a valid connection string.
We'll rely on 

Here's how to do the installs right in your global Python (no virtualenv) as installed via the OSX installer (as a "Framework"):

    /Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8 -m pip install -U pip
    /Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8 -m pip install great_expectations sqlalchemy sqlalchemy-vertica-python ipython

I like ipython, so you can use it to test the connection. Test it, in ipython:

    # /Library/Frameworks/Python.framework/Versions/3.8/bin/ipython
    import sqlalchemy as sa
    engine = sa.create_engine('vertica+vertica_python://dbadmin:foo123@localhost:5433/docker')
    engine.connect()

Go ahead and load the example file from GE's tutorial to the databse:

    import pandas as pd
    df = pd.read_csv("my_data/npidata_pfile_20200511-20200517.csv")
    ...

Now we can run through the GE tutorial, using a database.
You have the connection string above, so you'll chose the database option, (the "other", it might still be option 6),
and create the sample expectations of this table.

Cool!
