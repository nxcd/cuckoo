Cuckoo
===

Cuckoo is a microservice that schedules HTTP(S) requests.

- [NXCD's Cuckoo](#nxcds-cuckoo)
  - [Usage](#usage)
    - [POST /schedulings](#post-schedulings)
  - [More to come](#more-to-come)

## Usage

### POST /schedulings
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

> `payload`, `headers` and `params` are not required and should be ommited if not used

## More to come

![stability-wip](https://img.shields.io/badge/stability-wip-red.svg?style=flat-square)

Plans are to allow following actions to be done to schedulings:
- [ ] Listing
- [ ] Canceling
- [ ] Geting responses
- [ ] Repeating
- [ ] Copying
