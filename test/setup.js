const { expect } = require('chai');
const supertest = require('supertest');

global.supertest = supertest;
global.expect = expect;