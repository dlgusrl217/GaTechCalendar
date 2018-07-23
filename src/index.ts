import 'normalize.css';
import Vue from 'vue';
import rinss, { rss } from 'rinss';
const DatePicker = require('vue-datepicker2').default;

import fullCalendar from 'vue-fullcalendar';
Vue.component('full-calendar', fullCalendar);

import 'vue-mdc-adapter/dist/checkbox/checkbox.min.css';
Vue.use(require('vue-mdc-adapter/dist/checkbox/checkbox.min.js'));
import 'vue-mdc-adapter/dist/textfield/textfield.min.css';
Vue.use(require('vue-mdc-adapter/dist/textfield/textfield.min.js'));
import 'vue-mdc-adapter/dist/button/button.min.css';
Vue.use(require('vue-mdc-adapter/dist/button/button.min.js'));
import 'vue-mdc-adapter/dist/select/select.min.css';
Vue.use(require('vue-mdc-adapter/dist/select/select.min.js'));

rinss.config({
    position: 'relative',
    fontFamily: 'Arial',
    globalOverflowX: 'hidden'
});

const departments = ['OIE', 'SCPC', 'C2D2', 'This is a long ass department name'];
const events = [];

class CalendarEvent {
    public title:string;
    public start:string;
    public end:string;

    constructor(title:string, start:string, end = start) {
        this.title = title;
        this.start = start;
        this.end = end;
    }
}

Vue.component('MaterialCheckbox', {
    template: `
        <div>
            <mdc-checkbox :label="label"/>
        </div>
    `,
    props: {
        label: String
    }
});

Vue.component('MaterialDatePicker', {
    components: {
        DatePicker
    },
    template: `
        <div style="${ rss({ position: 'relative' }) }">
            <mdc-textfield label="Date" :value="date.time" style="${ rss({ width: '100%' }) }"/>
            <DatePicker :date="date" :option="option" style="${ rss({
                absLeft: 0,
                absTop: 15,
                width: '100%'
            }) }"/>
        </div>
    `,
    data() {
        return {
            date: {
                time: ''
            },
            option: {
                type: 'day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                format: 'YYYY-MM-DD',
                inputStyle: {
                    width: '100%',
                    height: '40px',
                    opacity: '0'
                }
            }
        };
    },
    watch: {
        'date.time'(val) {
            this.$emit('input', val);
        }
    }
});

Vue.component('AdminPanel', {
    template:`
        <div style="${ rss({ width: '100%', padding: 20, background: 'rgb(238, 238, 238)' }) }">
            <h4>Add event</h4>
            <mdc-textfield label="Event" v-model="eventName" style="${ rss({ width: '100%' }) }"/>
            <MaterialDatePicker v-model="startDate"/>
            <MaterialDatePicker v-model="endDate"/>
            <mdc-textfield label="Time" value="" style="${ rss({ width: '100%' }) }"/>
            <mdc-textfield label="Location" value="" style="${ rss({ width: '100%' }) }"/>
            <mdc-select label="Department" style="${ rss({ width: '100%' }) }">
                <option v-for="name of departments">{{name}}</option>
            </mdc-select>
            <mdc-button raised style="${ rss({ marginTop: 20 }) }" @click.native="saveEvent">Add event</mdc-button>
        </div>
    `,
    data(){
        return{
            departments,
            events,
            eventName: '',
            startDate: '',
            endDate: '',
        }
    },
    methods:{
        saveEvent(){
            this.events.push(new CalendarEvent(this.eventName, this.startDate, this.endDate));
        }
    }
});

new Vue({
    el: '#app',
    template:`
        <div style="${ rss({
            width: '100vw',
            maxWidth: 1200,
            height: '100vh',
            centerX: true,
        }) }">
            <div style="${rss({
                width: '70%',
                height: '100%',
                floatLeft:0,
            })}">
                <full-calendar :events="events" locale="en"/>
            </div>
            <div style="${rss({
                height: '100%',
                width: '30%',
                floatLeft:0,
            })}">
                <div style="${ rss({
                    width: '100%',
                    background: 'rgb(238, 238, 238)',
                    padding: 20 
                }) }">
                    <mdc-textfield label="Search" value="" outline style="${ rss({ width: '100%' }) }"/>
                    <h4>Filter by department</h4>
                    <MaterialCheckbox v-for="name of departments" :label="name"/>
                </div>
                <AdminPanel style="${ rss({ marginTop: 20 }) }"/>
            </div>
        </div>
    `,
    data () {
        return {
            departments,
            events,
        }
    }
});