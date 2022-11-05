const isDomainValid = require('../is-domain-valid');
const sampleDomainsList = require('./sample-domains-list');

describe('Domain validator tests', () => {
  it('Max length', () => {
    expect(isDomainValid('ocai6oiz9ezsrgjvrsdo1lakvxvqrtpcwixeljjyknbqjnyo9ajryikbk2kswtwoywvoeci72kzzdrpeqcdddyc2nocd2jqfiigtuck8lmfqnsdg2a8htnjijkn0x5p3fco1yz2makd2mvjznfdjzejhdah5qyyityivskocmdkrjfgwa94gkhnnqqztafehhizzsxs35drae9xwlavfesgpgwb1owjzzovhthtvmnsosreweeoybtzv02pfqr'))
      .toEqual({
        result: false,
        message: 'Domain contains more than 253 characters'
      });

    expect(isDomainValid('ocai6oiz9ezsrgjvrsdo1lakvxvqrtpcwixeljjyknbqjnyo9ajryikbk2kswtw.oywvoeci72kzzdrpeqcdddyc2nocd2jqfiigtuck8lmfqnsdg2a8htnjijkn0x5.p3fco1z2makd2mvjznfdjzejhdah5qyyityivskocmdkrjfgwa94gkhnnqqztaf.ehhizzsxs35drae9xwlavfesgpgwb1owjzzovhthtvmnsosreweeob02pf.eu'))
      .toEqual({
        result: true
      });
  });

  it('Labels num', () => {
    expect(isDomainValid('example'))
      .toEqual({
        result: false,
        message: 'Domain has to contain at least two labels'
      });

    expect(isDomainValid('example.technology'))
      .toEqual({
        result: true
      });
  });

  it('Labels', () => {
    expect(isDomainValid('ocai6oiz9ezsrgjvrsdo1lakvxvqrtpcwixeljjyknbqjnyo9ajryikbk2kswtwo.com'))
      .toEqual({
        result: false,
        message: 'Label ocai6oiz9ezsrgjvrsdo1lakvxvqrtpcwixeljjyknbqjnyo9ajryikbk2kswtwo contains more than 63 characters'
      });

    expect(isDomainValid('ocai6oiz9ezsrgjvrsdo1lakvxvqrtpcwixeljjyknbqjnyo9ajryikbk2kswtw.de'))
      .toEqual({
        result: true
      });

    expect(isDomainValid('exam_ple.com'))
      .toEqual({
        result: false,
        message: 'Label exam_ple contains a invalid character(s)'
      });

    expect(isDomainValid('-example.com'))
      .toEqual({
        result: false,
        message: 'Label -example begins with hyphen'
      });

    expect(isDomainValid('example-.com'))
      .toEqual({
        result: false,
        message: 'Label example- ends with hyphen'
      });

    expect(isDomainValid('exa--mple.com'))
      .toEqual({
        result: false,
        message: 'Label exa--mple contains consecutive hyphens'
      });

    expect(isDomainValid('exa-mple.com'))
      .toEqual({
        result: true
      });

    expect(isDomainValid('xn--examxn--ple.com'))
      .toEqual({
        result: false,
        message: 'Label xn--examxn--ple contains more than one xn-- pointers'
      });

    expect(isDomainValid('exampxn--le.com'))
      .toEqual({
        result: false,
        message: 'Label exampxn--le contains xn-- pointer not at the very beginning'
      });

    expect(isDomainValid('xn--c1yn--36f.com'))
      .toEqual({
        result: false,
        message: 'Label xn--c1yn--36f contains consecutive hyphens'
      });

    expect(isDomainValid('xn--c1yn36f.com'))
      .toEqual({
        result: true
      });

    expect(isDomainValid('xn--invalidccccc.com'))
      .toEqual({
        result: true
      });
  })

  it('TLD check', () => {
    expect(isDomainValid('example.unknowntld'))
      .toEqual({
        result: false,
        message: 'Tld unknowntld is not allowed'
      });

    expect(isDomainValid('example.academy'))
      .toEqual({
        result: true
      });
  });

  it('Subdomain', () => {
    expect(isDomainValid('sub.domain.com'))
      .toEqual({
        result: true
      });

    expect(isDomainValid('sub.domain.com', {
      allowSubdomain: false
    }))
      .toEqual({
        result: false,
        message: 'Subdomain is not allowed without allowSubdomain option'
      });
  });

  it('Wildcard', () => {
    expect(isDomainValid('*.domain.com', {
      allowWildcard: true
    }))
      .toEqual({
        result: true
      });

    expect(isDomainValid('*.subdomain.domain.com', {
      allowWildcard: true
    }))
      .toEqual({
        result: true
      });

    expect(isDomainValid('*.com', {
      allowWildcard: true
    }))
      .toEqual({
        result: false,
        message: 'Label * contains a invalid character(s)'
      });

    expect(isDomainValid('domain.*.com', {
      allowWildcard: true
    }))
      .toEqual({
        result: false,
        message: 'Label * contains a invalid character(s)'
      });

    expect(isDomainValid('domain.*', {
      allowWildcard: true
    }))
      .toEqual({
        result: false,
        message: 'Label * contains a invalid character(s)'
      });
  });

  it('Invalid types', () => {
    expect(isDomainValid(null)).toEqual({
      result: false,
      message: 'Invalid type. Pass domain as a string'
    });

    expect(isDomainValid(123)).toEqual({
      result: false,
      message: 'Invalid type. Pass domain as a string'
    });

    expect(isDomainValid()).toEqual({
      result: false,
      message: 'Invalid type. Pass domain as a string'
    });

    expect(isDomainValid(() => true)).toEqual({
      result: false,
      message: 'Invalid type. Pass domain as a string'
    });

    expect(isDomainValid(false)).toEqual({
      result: false,
      message: 'Invalid type. Pass domain as a string'
    });
  });

  it('Sample domains list tests', () => {
    sampleDomainsList.forEach((domain) => {
      expect(isDomainValid(domain)).toEqual({
        result: true
      });
    });
  });
});
