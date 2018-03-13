var expect      = require('chai').expect;
var bypassProxy = require('../index');

it('Should check does url match rule', function () {
    var rule = 'google.com';

    expect(bypassProxy('google.com.uk', rule)).to.be.false;
    expect(bypassProxy('docs.google.com', rule)).to.be.false;
    expect(bypassProxy('http://docs.google.com', rule)).to.be.false;
    expect(bypassProxy('https://docs.google.com', rule)).to.be.false;
    expect(bypassProxy('www.docs.google.com', rule)).to.be.false;
    expect(bypassProxy('http://docs.ggoogle.com', rule)).to.be.false;
    expect(bypassProxy('http://goooogle.com', rule)).to.be.false;
    expect(bypassProxy('gogoogle.com', rule)).to.be.false;
    expect(bypassProxy('http://google.com', rule)).to.be.true;
    expect(bypassProxy('https://google.com', rule)).to.be.true;
    expect(bypassProxy('https://google.com/', rule)).to.be.true;
    expect(bypassProxy('google.com/', rule)).to.be.true;

    rule = 'http://google.com';

    expect(bypassProxy('https://google.com', rule)).to.be.false;
    expect(bypassProxy('https://google.com/', rule)).to.be.false;
    expect(bypassProxy('docs.google.com', rule)).to.be.false;
    expect(bypassProxy('http://docs.google.com', rule)).to.be.false;
    expect(bypassProxy('https://docs.google.com', rule)).to.be.false;
    expect(bypassProxy('www.docs.google.com', rule)).to.be.false;
    expect(bypassProxy('http://docs.ggoogle.com', rule)).to.be.false;
    expect(bypassProxy('http://google.com', rule)).to.be.true;
    expect(bypassProxy('google.com/', rule)).to.be.true;

    rule = 'https://google.com';

    expect(bypassProxy('http://google.com', rule)).to.be.false;
    expect(bypassProxy('https://google.com', rule)).to.be.true;

    ['.google.com', '*.google.com'].forEach(r => {
        expect(bypassProxy('http://google.com', r)).to.be.false;
        expect(bypassProxy('https://google.com', r)).to.be.false;
        expect(bypassProxy('https://google.com/', r)).to.be.false;
        expect(bypassProxy('google.com/', r)).to.be.false;
        expect(bypassProxy('http://docs.ggoogle.com', r)).to.be.false;
        expect(bypassProxy('docs.google.com', r)).to.be.true;
        expect(bypassProxy('http://docs.google.com', r)).to.be.true;
        expect(bypassProxy('https://docs.google.com', r)).to.be.true;
        expect(bypassProxy('www.docs.google.com', r)).to.be.true;
    });

    ['.com', '*.com'].forEach(r => {
        expect(bypassProxy('http://google.com.uk', r)).to.be.false;
        expect(bypassProxy('http://google.com', r)).to.be.true;
        expect(bypassProxy('google.com/', r)).to.be.true;
        expect(bypassProxy('docs.google.com', r)).to.be.true;
        expect(bypassProxy('http://docs.google.com', r)).to.be.true;
        expect(bypassProxy('www.docs.google.com', r)).to.be.true;
    });

    ['google.', 'google.*'].forEach(r => {
        expect(bypassProxy('docs.google.com', r)).to.be.false;
        expect(bypassProxy('https://docs.google.co.uk', r)).to.be.false;
        expect(bypassProxy('https://docs.google.uk', r)).to.be.false;
        expect(bypassProxy('http://google.com', r)).to.be.true;
        expect(bypassProxy('https://google.co.uk', r)).to.be.true;
        expect(bypassProxy('google.ru/', r)).to.be.true;
    });

    ['docs.google.', 'docs.google.*'].forEach(r => {
        expect(bypassProxy('http://google.com', r)).to.be.false;
        expect(bypassProxy('docs.google', r)).to.be.false;
        expect(bypassProxy('https://docs.googlee.com', r)).to.be.false;
        expect(bypassProxy('www.docs.google.co.uk', r)).to.be.false;
        expect(bypassProxy('http://docs.ggoogle.com', r)).to.be.false;
        expect(bypassProxy('http://___docs.google.com', r)).to.be.false;
        expect(bypassProxy('docs.google.en', r)).to.be.true;
        expect(bypassProxy('http://docs.google.co.uk', r)).to.be.true;
    });

    ['.google.', '*.google.*'].forEach(r => {
        expect(bypassProxy('http://google.com', r)).to.be.false;
        expect(bypassProxy('docs.google.com', r)).to.be.true;
        expect(bypassProxy('http://docs.google.com', r)).to.be.true;
        expect(bypassProxy('www.docs.google.com', r)).to.be.true;
        expect(bypassProxy('www.my.docs.google.com', r)).to.be.true;

    });

    ['.docs.google.', '*.docs.google.*'].forEach(r => {
        expect(bypassProxy('http://google.com', r)).to.be.false;
        expect(bypassProxy('docs.google.com', r)).to.be.false;
        expect(bypassProxy('http://docs.google.com', r)).to.be.false;
        expect(bypassProxy('www.docs.google.com', r)).to.be.true;
        expect(bypassProxy('www.my.docs.google.com.eu', r)).to.be.true;
    });

    rule = 'docs.*.com';

    expect(bypassProxy('docs.google.com', rule)).to.be.true;
    expect(bypassProxy('docs.google.eu.com', rule)).to.be.true;
    expect(bypassProxy('docs.google.ru', rule)).to.be.false;
    expect(bypassProxy('docs.google.co.uk', rule)).to.be.false;

    rule = 'docs.*.*.com';

    expect(bypassProxy('docs.google.com', rule)).to.be.false;
    expect(bypassProxy('docs.google.ru', rule)).to.be.false;
    expect(bypassProxy('my.docs.google.ro.eu.com', rule)).to.be.false;
    expect(bypassProxy('docs.google.co.uk', rule)).to.be.false;
    expect(bypassProxy('docs.google.eu.com', rule)).to.be.true;
    expect(bypassProxy('docs.google.ro.eu.com', rule)).to.be.true;

    rule = '.docs.*.*.com.';

    expect(bypassProxy('my.docs.google.eu.com.ru', rule)).to.be.true;

    rule = 'docs.g*e.com';

    expect(bypassProxy('docs.google.com', rule)).to.be.false;

    rule = 'localhost';

    expect(bypassProxy('localhost', rule)).to.be.true;
    expect(bypassProxy('http://localhost', rule)).to.be.true;
    expect(bypassProxy('my-localhost', rule)).to.be.false;
    expect(bypassProxy('localhost-my', rule)).to.be.false;

    rule = '127.0.0.1';

    expect(bypassProxy('127.0.0.1', rule)).to.be.true;
    expect(bypassProxy('http://127.0.0.1', rule)).to.be.true;
    expect(bypassProxy('https://127.0.0.1', rule)).to.be.true;

    rule = '127.0.0.';

    expect(bypassProxy('127.127.0.0', rule)).to.be.false;
    expect(bypassProxy('127.0.0.2', rule)).to.be.true;

    rule = '.0.0.';

    expect(bypassProxy('127.0.1.2', rule)).to.be.false;
    expect(bypassProxy('127.0.0.2', rule)).to.be.true;

    rule = '127.*.*.0';

    expect(bypassProxy('128.120.120.0', rule)).to.be.false;
    expect(bypassProxy('127.0.0.0', rule)).to.be.true;
    expect(bypassProxy('127.120.120.0', rule)).to.be.true;

    rule = 'google.com:81';

    expect(bypassProxy('google.com', rule)).to.be.false;
    expect(bypassProxy('google.com:80', rule)).to.be.false;
    expect(bypassProxy('google.com:81', rule)).to.be.true;

    rule = 'google.:81';

    expect(bypassProxy('google.com', rule)).to.be.false;
    expect(bypassProxy('google.com:80', rule)).to.be.false;
    expect(bypassProxy('google.com:81', rule)).to.be.true;

    rule = 'localhost:3000';

    expect(bypassProxy('localhost:3000/features/functional/local', rule)).to.be.true;
    expect(bypassProxy('http://localhost:3000/features/functional/local', rule)).to.be.true;
    expect(bypassProxy(null, rule)).to.be.false;

    rule = 1;

    expect(bypassProxy('google', rule)).to.be.false;
});
