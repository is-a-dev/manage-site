# Is Domain Valid
Dependency free domain name syntax validator with TLD checking and IDN support. See below examples to check what the validator checks for:

### Valid examples

```javascript
example.com
sub.example.com // allowSubdomain options is requried
exa-mple.com
xn--c1yn36f.com // allowIdn option is required
*.wildcard.com // allowWildcard and allowSubdomain options are required
```

### Invalid examples

```javascript
123
123.123 // checkTld option is required
example
exam_ple.com
-example.com
example-.com
exa--mple.com
example.doesnotexist // checkTld option is required
xn--c1yn--bb.com
*.com
example.*.com
```

## Installation

Install the library with `npm --save is-domain-valid`

## Usage

```javascript
const isDomainValid = require('../is-domain-valid');
const res = isDomainValid('example.com');
if (res.result) {
  console.log('Domain is valid');
} else {
  console.error(`Domain is not valid because of: ${res.message}`);
}
```

## Options

Options can be passed as a second argument in `isDomainValid` function:

```javascript
const defaultOptions = {
  checkTld: true,
  allowIdn: true,
  allowSubdomain: true,
  allowWildcard: false
};
const res = isDomainValid('example.com', defaultOptions);
```

## Build and contribution

Push requests are very welcome. Run tests with `npm run tests` and then build the library with `npm run build`.

## Author

Adam Blok: https://github.com/adamblok

## License

MIT
