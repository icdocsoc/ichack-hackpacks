# Relational databases and PostgreSQL

## Relational dabatases

Relational databases are databases based upon [a specific model](https://en.wikipedia.org/wiki/Relational_model) of storing data, wherein data is represented by tuples (groups of values of fixed size, more commonly referred to as rows) and relations (more commonly known as tables). A table specifies the data's organisation in terms of column titles and types, and each row has the same number of entries as specified in the table's details. Basically, relational databases are made up of many tables, each with a fixed number of columns, and each entry in said table (each row) is one data-point.

Relational databases also have constraints (i.e. things that the database is guaranteed to fulfill) and changes that violate the constraints don't get made. The most common types of constraints are keys and foreign keys.

**Keys**: Keys guarantee uniqueness within tables. Within a table, certain columns can be marked as "key", which means that no two values within the column are the same. Therefore, given a key and the column it originates from, it's always possible to determine the unique row that came from.

**Foreign Keys**: A foreign key is guaranteed to reference another row. Within a table, rows marked as foreign keys are guaranteed to point to a key of a specified different table.

With these two constraints, we can model quite a lot of relationships between data while maintaining constraints, making it easy to use the data practically.

## PostgreSQL

PostgreSQL is the most commonly used relational database. It uses SQL (Structured Query Language), an industry standard for relational databases.

> This section covers setting up PostgreSQL, not how to use SQL. For that, there's a good tutorial [here](https://www.w3schools.com/sql/), but with modern interfaces to databases you might never need to write SQL manually.

PostgreSQL can be set-up locally, or through [Docker](/deployment-approaches/docker/README.md)(reccomended). To set-up locally, download the package from [the PostgreSQL page](https://www.postgresql.org/download/) and install. Docker gives an easier way to restart and erase data, or to switch between databases. It's covered in depth in the [Docker hackpack](/deployment-approaches/docker/README.md) (with a PostgreSQL example), but in summary either run the command `docker run postgres -e POSTGRES_PASSWORD=some_password -p 5432:5432 -v ./my/own/datadir:/var/lib/postgresql` with relevant bits (the password, the port, and the local data-directory) configured correctly) or use the Docker Compose file from the hackpack.

Once you have PostgreSQL set-up, you can either interface with it through raw SQL (not massively useful, but documented in more detail [here](https://www.w3schools.com/postgresql/)), or use some sort of library built for your language. 

### ORMs
ORMs or Object-Relational Mappings, are tools, libraries, or interfaces to a database that emulate an object-oriented approach to data storage through a relational database. In essence, they translate object-oriented principles into things compatible with relational models, allowing you to use an object-oriented approach.

ORMs for languages you might use include [Prisma](https://www.prisma.io/) for JavaScript/TypeScript, which also manages things like migrations (changing the structure of your database) and can manage PostgreSQL itself. Python's Django has [an ORM built in](https://docs.djangoproject.com/en/6.0/topics/db/), but if you'd prefer to do it differently [SQLAlchemy](https://www.sqlalchemy.org/) is also an option.
