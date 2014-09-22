/**
 * Created by U8013621 on 21/09/2014.
 */
var Moment = require('moment');
    now = new Moment().toString();

var hannu_raw_msg_1 = JSON.stringify(
        {
            end_point: "endpoint_1",
            summary: "A computer is having a crisis about CPU!",
            status: "critical",
            occurred_at: "2014-09-16T17:50:42.000Z",
            producer_hannu_raw_sent_at: now
        }, null, 1)
    ;
var hannu_raw_msg_2 = JSON.stringify(
    {
        end_point: "endpoint_2",
        summary: "A computer is having a crisis about Memory!",
        status: "critical",
        occurred_at: "2014-09-16T17:50:42.000Z",
        producer_hannu_raw_sent_at: now
    }, null, 1);

var hannu_storm_in_a_teacup_msgs = JSON.stringify([
    {
        end_point: "endpoint_flippy",
        summary: "A computer is having a crisis about NIC UP!",
        status: "critical",
        occurred_at: "2014-09-16T17:50:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flappy",
        summary: "A computer is having a crisis about NIC DOWN!",
        status: "critical",
        occurred_at: "2014-09-16T17:51:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flippy",
        summary: "A computer is having a crisis about NIC UP!",
        status: "critical",
        occurred_at: "2014-09-16T17:52:42.000Z",
        producer_hannu_raw_sent_at: now
    },
    {
        end_point: "endpoint_flappy",
        summary: "A computer is having a crisis about NIC DOWN!",
        status: "critical",
        occurred_at: "2014-09-16T17:53:42.000Z",
        producer_hannu_raw_sent_at: now
    }], null, 1);

