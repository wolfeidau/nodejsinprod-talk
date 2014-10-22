# Introduction

Doing a talk at the Melbourne NodeJS meetup on "Nodejs in production" which demos some basic operational monitoring using off the shelf stuff.

Slides are at [NodeJS in Production](https://speakerdeck.com/wolfeidau/nodejs-in-production).

# Setup

* Install influxdb.

```
brew install influxdb
```

* Fix configuration of influxdb by changing from rocksdb backend to leveldb.

```
vim /usr/local/etc/influxdb.conf
```

** Change line.

```
default-engine = "rocksdb"
```

** Too.

```
default-engine = "leveldb"
```

* Grab a copy of statsd.

```
git clone https://github.com/etsy/statsd
```

* Install the influxdb plugin.

```
cd statsd
 npm install statsd-influxdb-backend
```

* Use the following configuration file.

```js
{
  port: 8125
, backends: [ "statsd-influxdb-backend" ]
, influxdb: {
    host: '127.0.0.1'
    , port: 8086
    , database: 'NodeJS'
    , username: 'root'
    , password: 'root'
  }
}
```

* Grab a copy of graphana.

```
git clone https://github.com/grafana/grafana
```

* Install my NodeJS dashboard.

```
cp NodeJS.json where/ever/graphana/app/dashboards
```

* Start all the things.

```
influxdb -config=/usr/local/etc/influxdb.conf &
cd Code/Javascript/statsd
node stats.js influxdbConfig.js &
cd Code/Javascript/grafana
python -m SimpleHTTPServer
```

Load up [http://localhost:8000/#/dashboard/file/NodeJS.json](http://localhost:8000/#/dashboard/file/NodeJS.json).
