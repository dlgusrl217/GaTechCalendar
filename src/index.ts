import "fetch-polyfill";
import 'promise-polyfill/src/polyfill';

import 'normalize.css';
import Vue from 'vue';
import rinss, { rss } from 'rinss';
import { parseString } from 'xml2js';
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
import { pullOne, values, forOwn, pushOne, clear } from '../node_modules/ambients-utils';
Vue.use(require('vue-mdc-adapter/dist/select/select.min.js'));


const VueQRCodeComponent = require('vue-qrcode-component').default;
Vue.component('qr-code', VueQRCodeComponent);

rinss.config({
    position: 'relative',
    fontFamily: 'Arial',
    globalOverflowX: 'hidden'
});

const departments = [];
const events:Array<CalendarEvent> = [];
const addIcon = require('./icons/add.svg');
const deleteIcon = require('./icons/delete.svg');

async function getData(cb:Function) {
    const response = await fetch(new Request('/test.xml'), { mode: 'no-cors' });
    const str = await response.text();
    parseString(str, (err, result)=>{
        forOwn(result.nodes.node, v=>{
            const names:Array<string> = [];
            for (const g of v.groups[0].group) {
                pushOne(departments, g['_']);
                names.push(g['_']);
            }
            events.push(new CalendarEvent(v.title[0], v.gmt_start[0], v.gmt_end[0], names, v.$.id));
        });
        cb();
    });
}

class CalendarEvent {
    public title:string;
    public start:string;
    public end:string;
    public departments:Array<string>;
    public url:string;

    constructor(title:string, start:string, end = start, departments:Array<string>, id:string) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.departments = departments;
        this.url = `http://oie.gatech.edu/hg/node/${ id }`;
    }
};

Vue.component('QR',{
    template:`
        <div style="${ rss({
            height: '100%',
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            absTop: 0,
            absLeft: 0,
            zIndex: 100,
        }) }" @click="close">
            <div style = "${ rss({
                height: 500,
                width: 500,
                centerX: true,
                centerY: true,
                background: 'white',
            })}">
                <qr-code :text="url" style="${ rss({
                    centerX: true,
                    centerY: true,
                    cursor: 'pointer',
                }) }" @click.native="tourl"/>
                <mdc-button style="${rss({
                    absBottom:50,
                    centerX: true,
                })}" @click.native="tourl">
                    Descriptions
                </mdc-button>
            </div>
        </div>
    `,
    props:{
        url:String,
    },
    methods:{
        tourl(){
            open(this.url);
        },
        close(){
            this.$emit('close');
        }
    }
});

// Vue.component('eventCards', {
//     template:`
//         <div style="${rss({
//             height: '100%',
//             width: '100%',
//             background: 'rgba(0,0,0,0.2)',
//             absTop: 0,
//             absLeft: 0,
//             zIndex: 100,
//         })}" >
//             <div style = "${ rss({
//                 height: 500,
//                 width: 500,
//                 centerX: true,
//                 centerY: true,
//                 background: 'white',
//                 padding: 20
//             })}">
//                 <div style="${rss({
//                     height: 30,
//                     width: 30,
//                 })}" @click="close">${deleteIcon}</div>
//                 <mdc-textfield v-model="text" label="Title" style="${ rss({ width: '100%' }) }" outline/>
//             </div>
//         </div>
//     `,
//     data() {
//         return{
//             text:"Title of the event",
//         }
//     },
//     methods:{
//         close(){
//             this.$emit('close')
//         }
//     },
// });

Vue.component('MaterialDatePicker', {
    components: {
        DatePicker
    },
    template: `
        <div style="${ rss({ position: 'relative' }) }">
            <mdc-textfield :label="dateTitle" :value="date.time" style="${ rss({ width: '100%' }) }"/>
            <DatePicker :date="date" :option="option" style="${ rss({
                absLeft: 0,
                absTop: 18,
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
    },
    props:{
        dateTitle:String,
    },
});

// Vue.component('AdminPanel', {
//     template:`
//         <div style="${ rss({ width: '100%', padding: 20, background: 'rgb(238, 238, 238)' }) }">
//             <h4>Add event</h4>
//             <mdc-textfield label="Event" v-model="eventName" style="${ rss({ width: '100%' }) }"/>
//             <MaterialDatePicker dateTitle="Start Date" v-model="startDate"/>
//             <MaterialDatePicker dateTitle="End Date" v-model="endDate"/>
//             <mdc-textfield label="Time" value="" style="${ rss({ width: '100%' }) }"/>
//             <mdc-textfield label="Location" value="" style="${ rss({ width: '100%' }) }"/>
//             <mdc-select label="Department" style="${ rss({ width: '100%' }) }">
//                 <option v-for="name of departments">{{name}}</option>
//             </mdc-select>
//             <mdc-button raised style="${ rss({ marginTop: 20 }) }" @click.native="saveEvent">Add event</mdc-button>
//         </div>
//     `,
//     data(){
//         return{
//             departments,
//             events,
//             eventName: '',
//             startDate: '',
//             endDate: '',
//             department:'',
//         }
//     },
//     methods:{
//         saveEvent(){
//             // this.events.push(new CalendarEvent(this.eventName, this.startDate, this.endDate, this.department));
//             // this.eventName = '';
//             // this.startDate = '';
//             // this.endDate = '';
//             // this.department = '';
//         }
//     }
// });

// Vue.component('AddDepartmentPanel', {
//     template:`
//         <div style="${ rss({
//             width: '100%',
//             background: 'rgb(238,238,238)',
//             padding: 20,
//             marginTop: 20,
//         })}">
//             <h4>Add department</h4>
//             <div v-for="name of departments" style="${rss({
//                 width:'100%',
//                 floatTop:10,
//             })}">
//                 <div style="${rss({
//                     width:20,
//                     height:20,
//                     color:'gray',
//                     floatLeft:0,
//                 })}" @click="deleteDepartment(name)">${deleteIcon}
//                 </div>
//                 <div style="${rss({
//                     floatLeft:10,
//                 })}">{{ name }}</div>
                
//             </div>
//             <div style="${rss({
//                 width:'100%',
//                 floatTop:10,
//             })}">
//                 <div style="${rss({
//                     width:20,
//                     height:20,
//                     color:'gray',
//                     floatLeft:0
//                 })}" @click="saveDepartment">${addIcon}
//                 </div>
//                 <input ref="departmentName" placeholder="Add department" @keydown="checkEnter" style="${rss({
//                     floatLeft:10,
//                     border:'none',
//                     background:'none'
//                 })}"/>
//             </div>
//         </div>
//     `,
//     props:{
//         departments:Array,
//     },
//     methods:{
//         checkEnter(event:KeyboardEvent) {
//             if (event.code === 'Enter') {
//                 (this as any).departments.push((this.$refs.departmentName as HTMLInputElement).value);
//                 (this.$refs.departmentName as HTMLInputElement).value = '';
//             }
//         },
//         deleteDepartment(name){
//             pullOne((this as any).departments, name);
//         },
//         saveDepartment(){
//             (this as any).departments.push((this.$refs.departmentName as HTMLInputElement).value);
//             (this.$refs.departmentName as HTMLInputElement).value = '';
//         }
//     }
// })

const filterNames:Array<string> = [];

new Vue({
    el: '#app',
    template:`
        <div style="${ rss({
            width: '100vw',
            maxWidth: 1200,
            height: '100vh',
            overflow: 'hidden',
            centerX: true,
        }) }">
            <div style="${rss({
                width: '70%',
                height: '100%',
                floatLeft:0,
            })}">
                <full-calendar :events="displayedEvents" locale="en" @eventClick="eventClick"/>
            </div>
            <div style="${rss({
                height: '100%',
                width: '30%',
                floatLeft:0,
                // overflowY: 'scroll',
                // overflowX: 'hidden',
            })}">
                <div style="${ rss({
                    width: '100%',
                    background: 'rgb(238, 238, 238)',
                    padding: 20,
                    height:'auto',
                }) }">
                    <mdc-textfield label="Search" value="" outline style="${ rss({ width: '90%' }) }"/>
                    <h4>Filter by department</h4>

                    <div v-for="name of departments">
                        <mdc-checkbox :label="name" checked @input.native="editFilter($event, name)"/>
                    </div>
                </div>
            </div>
            <QR v-if="showQR" :url="url" @close="showQR=false"/>
        </div>
    `,
    data () {
        return {
            departments,
            displayedEvents: [] as Array<CalendarEvent>,
            showQR: false,
            url: ''
        }
    },
    mounted() {
        getData(()=>{
            for (const event of events) this.displayedEvents.push(event);
            for (const name of departments) filterNames.push(name);
        });
    },
    methods: {
        eventClick(e) {
            this.showQR = true;
            this.url = e.url;
            // open(e.url);
            // console.log(e);
        },
        editFilter(e, name) {
            if (!e.target.checked) pullOne(filterNames, name);
            else pushOne(filterNames, name);

            clear(this.displayedEvents);
            for (const event of events){
                let inFilterName = false;
                for (const name of filterNames){
                    if (event.departments.indexOf(name) > -1) {
                        inFilterName = true;
                        break;
                    }
                }
                if (inFilterName){
                    this.displayedEvents.push(event);
                }
            }
        }
    }
});