# Cuckoo

> A microservice that schedules HTTP(S) requests

Cuckoo is a microservice that schedules HTTP(S) requests.

- [Cuckoo](#cuckoo)
  - [Usage](#usage)
    - [Database](#database)
    - [Headers](#headers)
    - [Errors](#errors)
    - [Endpoints](#endpoints)
      - [POST /schedulings](#post-schedulings)
      - [GET /schedulings/:scheduling-id](#get-schedulingsscheduling-id)
      - [DELETE /schedulings/:scheduling-id](#delete-schedulingsscheduling-id)
  - [More to come](#more-to-come)

## Usage

### Database

Cuckoo is a microservice, because of that, it uses a database to store its schedulings, which is MongoDB.

In order to get Cuckoo to work, you need to have a Mongo instance with a valid empty database which Cuckoo will use to store its data.

See:

- [How to run a Mongo Docker image](https://hub.docker.com/_/mongo)
- [MongoDB Website](https://www.mongodb.com/download-center/community)

Then set an `.envrc` file with your variables following the `.envrc.sample` file in order to run it in development. For production, set these as environment variables

### Headers
Every request of this microservice accepts the following headers:

- `x-on-beahlf-of`: Id of the user who created the scheduling
- `x-app-id`: Id of the client app that was used to create the scheduling

### Errors
Every error will be reported by this microservice following this schema:

```json
{
  "status": 404,
  "error": {
    "code": "not_found",
    "message": "Scheduling \"123\" could not be found"
  }
}
```

### Endpoints

#### POST /schedulings
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)

Body:
```json
{
  "timestamp": "2019-01-21T17:59:00-02:00",
  "method": "post",
  "url": "http://some.box.api/boxes",
  "payload": {
    "name": "Box name"
  },
  "headers": {
    "x-on-behalf-of": "urn:user:5c46285291a0b20f65224905"
  },
  "params": {
    "fields": "name,email"
  }
}
```

Response:
```json
{
  "id": "5c473258439c897ca1a40ff7",
  "timestamp": "2019-01-22T15:11:00.000Z",
  "method": "post",
  "url": "http://some.box.api/boxes",
  "payload": {
    "name": "Box name"
  },
  "headers": {
    "x-on-behalf-of": "urn:user:5c46285291a0b20f65224905"
  },
  "params": {
    "fields": "name,email"
  },
  "status": "scheduled",
  "createdAt": "2019-01-22T15:10:16.635Z",
  "createdBy": "urn:user:5c471ad29f786f6df5c42c25",
  "createdThrough": "insomnia"
}
```

> `payload`, `headers` and `params` are not required and should be ommited if not used

#### GET /schedulings/:scheduling-id
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)

Response:
```json
{
  "id": "5c46245e6551b501a9010ff4",
  "timestamp": "2019-01-21T19:59:00.000Z",
  "method": "post",
  "url": "http://some.box.api/boxes",
  "payload": {
    "name": "Box Name"
  },
  "headers": {
    "x-on-behalf-of": "urn:user:5c46285291a0b20f65224905"
  },
  "params": {
    "fields": "name,email"
  },
  "status": "executed",
  "createdAt": "2019-01-21T19:58:22.750Z",
  "createdBy": null,
  "createdThrough": null,
  "response": {
    "data": {
      "id": "5c46248408325c1c23e0a795"
    },
    "headers": {
      "deeptrace-id": "97aaa10c-7771-4dde-b511-21a2384c85a9",
      "x-dns-prefetch-control": "off",
      "x-frame-options": "SAMEORIGIN",
      "strict-transport-security": "max-age=15552000; includeSubDomains",
      "x-download-options": "noopen",
      "x-content-type-options": "nosniff",
      "x-xss-protection": "1; mode=block",
      "access-control-allow-origin": "*",
      "content-type": "application/json; charset=utf-8",
      "content-length": "33",
      "etag": "W/\"21-LkAtI29nvWWF1kELvtNCI7TEtIo\"",
      "date": "Mon, 21 Jan 2019 19:59:00 GMT",
      "connection": "close"
    },
    "status": 201
  }
}
```

#### DELETE /schedulings/:scheduling-id
![stability-stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)

Body: `empty`

Response: `empty`

## More to come

![stability-wip](https://img.shields.io/badge/stability-wip-red.svg?style=flat-square)

Plans are to allow following actions to be done to schedulings:
- [ ] Listing
- [X] [Canceling](#delete-schedulingsscheduling-id)
- [X] [Geting responses](#get-schedulingsscheduling-id)
- [ ] Repeating
- [ ] Copying
