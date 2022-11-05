const tldList = require('./tld-list');

const isDomainValid = (domain, options) => {
  if (typeof domain !== 'string') {
    return {
      result: false,
      message: 'Invalid type. Pass domain as a string'
    };
  }

  domain = domain.toLowerCase().trim();

  const defaultOptions = {
    checkTld: true,
    allowIdn: true,
    allowSubdomain: true,
    allowWildcard: false
  };
  options = {...defaultOptions, ...options};

  if (!domain || domain.length < 1) {
    return {
      result: false,
      message: 'No domain provided'
    };
  }

  if (domain.length > 253) {
    return {
      result: false,
      message: 'Domain contains more than 253 characters'
    };
  }

  const labels = domain.split('.');
  if (!labels || labels.length < 2) {
    return {
      result: false,
      message: 'Domain has to contain at least two labels'
    };
  }

  if (labels.length > 2) {
    if (!options.allowSubdomain) {
      return {
        result: false,
        message: 'Subdomain is not allowed without allowSubdomain option'
      };
    }

    if (labels[0] === '*') {
      if (!options.allowWildcard) {
        return {
          result: false,
          message: 'Wildcard is not allowed without allowWildcard option'
        };
      }

      labels.shift();
    }
  }

  for (let label of labels) {
    if (label.length > 63) {
      return {
        result: false,
        message: `Label ${label} contains more than 63 characters`
      };
    }

    if (label.match(/[^a-zA-Z0-9\-]/)) {
      return {
        result: false,
        message: `Label ${label} contains a invalid character(s)`
      };
    }

    if (label.substr(0, 1) === '-') {
      return {
        result: false,
        message: `Label ${label} begins with hyphen`
      };
    }

    if (label.substr(-1) === '-') {
      return {
        result: false,
        message: `Label ${label} ends with hyphen`
      };
    }

    /**
     * IDN
     */
    let checkConsecutiveHyphensFor = label;

    if (options.allowIdn) {
      const xnCount = (label.match(/xn--/g) || []).length;
      if (xnCount === 1) {
        if (label.indexOf('xn--') !== 0) {
          return {
            result: false,
            message: `Label ${label} contains xn-- pointer not at the very beginning`
          };
        }

        checkConsecutiveHyphensFor = label.substr('xn--'.length);
      } else if (xnCount > 1) {
        return {
          result: false,
          message: `Label ${label} contains more than one xn-- pointers`
        };
      }
    }

    if (checkConsecutiveHyphensFor.indexOf('--') !== -1) {
      return {
        result: false,
        message: `Label ${label} contains consecutive hyphens`
      };
    }
  }

  /**
   * TLD
   */
  if (options.checkTld) {
    const tld = labels[labels.length - 1];
    if (tldList.indexOf(tld) === -1) {
      return {
        result: false,
        message: `Tld ${tld} is not allowed`
      };
    }
  }

  return {
    result: true
  };
};

module.exports = isDomainValid;
