'use strict';

var libPath = process.env['kafka-cov'] ? '../lib-cov/' : '../lib/',
    Zookeeper = require(libPath + 'zookeeper').Zookeeper;

var zk;

/*
 *  To run the test, you should ensure:
 *  1. at least 2 broker running
 *  2. zookeeper server running at localhost:2181
 *  3. create path kafka0.8 in zookeeper
 */

before(function () {
    zk = new Zookeeper('kafka01:2181/');
});

describe.skip('Zookeeper', function () {
    describe('when init success', function () {
        it('should emit init event', function (done) {
            var zk = new Zookeeper('kafka01:2181/');
            zk.on('init', function (brokers) {
                Object.keys(brokers).length.should.equal(1);
                done();
            });
        });
    }); 

    describe('#listBrokers', function () {
        describe('when client not init', function () {
            it('should return only 1 broker', function (done) {
                zk.inited = false;
                zk.listBrokers(function (brokers) {
                    Object.keys(brokers).length.should.equal(1);
                    done()
                });
            });
        });

        describe('when client inited', function () {
            it('should return all brokers and emit brokersChanged event', function (done) {
                var count = 0;
                zk.inited = true;

                zk.listBrokers(function (brokers) {
                    Object.keys(brokers).length.should.above(1);
                    if (++count == 2) done();
                });

                zk.on('brokersChanged', function (brokers) {
                    Object.keys(brokers).length.should.above(1);
                    if (++count == 2) done();
                });
            });
        });
    });

    describe('#topicExists', function () {
        it('should return false when topic not exist', function (done) {
            zk.topicExists('_not_exist_topic_test', function (existed, topic) {
                existed.should.not.be.ok;
                topic.should.equal('_not_exist_topic_test'); 
                done();
            }); 
        });
    });
});
