const config = require('./protractor.conf').config;

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--no-sandbox', '--disable-gpu'],
        binary: process.env.HEADLESS ? require('puppeteer').executablePath() : undefined,
    },
};

exports.config = config;