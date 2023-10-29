<template>
    <div class="container-fluid">
        <div class="filter">
            <div class="filter-box">
                <!-- {{ DataGiaoBai }} -->
                <div class="filter-item">
                    <filter-date @change-value="changeFilterDate"></filter-date>
                </div>
                <br>
                <div class="filter-item">
                    <div class="row">
                        <filter-option @change-value="changeFilterRegion" :placeholder="'chọn khu vực'" class="col" track-by="id" label="name" :data="regions"></filter-option>
                        <filter-option :placeholder="'chọn trường'" class="col" track-by="id" label="name" :data="centers"></filter-option>
                        <filter-option :placeholder="'chọn cấp'" class="col" track-by="id" label="name" :data="levels"></filter-option>
                        <filter-option :placeholder="'chọn lớp'" class="col" track-by="id" label="name" :data="listClass"></filter-option>
                        <div class="col-1"><button type="button" class="btn btn-search btn-primary" v-on:click="applySearch">Tìm kiếm</button></div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="data-table">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th rowspan="2">STT</th>
                        <th rowspan="2">Tên</th>
                        <th rowspan="2">Tổng hợp</th>
                        <th colspan="4">Bài giao</th>
                        <th colspan="4">Bài tự luyện</th>
                        <th colspan="4">Bài qua link</th>
                    </tr>
                    <tr>
                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>
                        <th>SL</th>

                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>
                        <th>SL</th>

                        <th>Điểm tb</th>
                        <th>Thời gian tb</th>
                        <th>TLTG</th>
                        <th>SL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,i) in regions" :key="i">
                        <td>{{ (i+1) }}</td>
                        <td style="text-align: left; width: 250px; text-overflow: ellipsis;">{{ item.name }}</td>
                        <td>
                            <p style="text-align: left;">Trường :    {{ '' }}/{{ totalSchool    (item.id,0) }}</p>
                            <p style="text-align: left;">Lớp :       {{ totalClassActive(item.id,0) }}/{{ totalClass     (item.id,0) }}</p>
                            <p style="text-align: left;">Học sinh :  {{ totalStudentActive(item.id,0) }}/{{ totalStudent   (item.id,0) }}</p>
                            <p style="text-align: left;">Bài giao :  {{ totalLesson    (item.id,0) }}</p>
                            <p style="text-align: left;">Điểm :      {{ totalPoint     (item.id,0) }}</p>
                            <p style="text-align: left;">Thời gian : {{ totalTime      (item.id,0) }}</p>
                        </td>
                        <td>{{ totalPoint     (item.id,0) }}</td>
                        <td>{{ totalTime      (item.id,0) }}</td>
                        <td>{{ totalStudentActive(item.id,0) }}/{{ totalStudent   (item.id,0) }}</td>
                        <td>{{ totalLesson    (item.id,0) }}</td>
                        
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import FilterDate from '../components/filters/FilterDate.vue'
import FilterOption from '../components/filters/FilterOption.vue'
import Helper from '../utils/helper'
export default defineComponent({
    name:'report-table',
    components:{FilterDate,FilterOption},
    mounted(){
        this.loadRegions();
    },
    watch:{
        "end":function(o,v){
            console.log(o,v);
        }
    },
    data(){
        return {
            DataGiaoBai:[],
            ListClassData:[],
            DataCountStudents:[],
            DataLoadDing:{
                Center:[],
                Class:[],
                Student:[]
            },
            DataCountCenter:[],
            DataCountClass:[],
            filter:{
                region:null,
                center:null,
                level:null,
                class:null,
            },
            start:null,
            end:null,
            regions:[],
            centers:[],
            listClass:[],
            levels:[]
        }
    },
    methods:{
        onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
        },
        totalStudentActive(id,type){
            console.log(type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0 && o.tyLeThamGia.length > 0);
            if(data != null){
                var studentids = [];
                data.forEach(item=>{
                    studentids = [].concat(studentids,item.studentDo)
                })
                if(studentids.length > 0){
                    return studentids.length;
                }
            }
            
            return 0;
        },
        totalClassActive(id,type){
            console.log(type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data) return data.length

            return 0;
        },
        totalSchool    (id,type){
            console.log(type);
            var item = this.DataCountCenter.find(o=>o.id==id);
            if(item) return item.value;
            return 0;
        },
        totalClass     (id,type){
            console.log(type);
            var item = this.DataCountClass.find(o=>o.id==id);
            if(item) return item.value;
            return 0;
        },
        totalStudent   (id,type){
            console.log(type);
            var item = this.DataCountStudents.find(o=>o.id==id);
            if(item) return item.value;
        },
        totalLesson    (id,type){
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0 && o.tyLeThamGia.length > 0);
            if(data && data.length > 0){
                return data.map(o=>o.tyLeThamGia.length).reduce((a,b)=>a+b,0);
            }
            console.log(id,type);
            return 0;
        },
        totalPoint     (id,type){
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data != null && data.length > 0){
                return (data.map(o=>o.ktPoints).reduce((a,b)=>a+b,0)/data.length).toFixed(1)+"/"+(data.map(o=>o.ltPoints).reduce((a,b)=>a+b,0)/data.length).toFixed(1)
            }
            console.log(id,type);
            return 0;
        },
        totalTime      (id,type){
            console.log(id,type);
            var data =this.DataGiaoBai.filter(o=>o.parent == id && o.totalLesson > 0);
            if(data != null && data.length > 0){
                return (data.map(o=>o.ktTimes).reduce((a,b)=>a+b,0)/data.length).toFixed(1)+"/"+(data.map(o=>o.ltTimes).reduce((a,b)=>a+b,0)/data.length).toFixed(1)
            }
            return 0;
        },
        applySearch(){
            const that = this;
            if(this.filter.class){
                console.log("filter - class")
            }
            else{
                
                if(this.filter.center){
                    console.log("filter - center")
                }
                else{
                    if(this.filter.region)
                    {
                        console.log("filter - region")
                    }
                    else{
                        this.DataCountStudents = [];
                        this.DataCountCenter = [];
                        this.DataCountClass = [];
                        this.DataLoadDing = {
                            Center:[],
                            Class:[],
                            Student:[]
                        }
                        this.DataGiaoBai = [];
                        console.log("run");
                        const data = [].concat([],this.regions);
                        console.log(data);
                        data.forEach(o=>{
                            that.countCenters(o.id,0)
                            that.countClass(o.id,0)
                            that.countStudents(o.id,0)
                        });
                        // if(this.ListClassData.length > 0){
                        //     this.ListClassData.forEach(o=>{
                        //         that.loadDataByClass(o.l,o.id,o.type,0);
                        //     });
                        // }
                    }
                }
            }
        },
        loadRegions(){
            const that = this;
            Helper.loadRegions().then(res=>{
                that.regions = res.data;
            })
        },
        changeFilterRegion : function(value){
            if(value != this.filter.regions){
                this.filter.region = value;
            }
            if(value){
                const that = this;
                Helper.loadCenters(value.id).then(res=>{
                    that.centers = res.data;
                })
            }
            else{
                this.filter.center = null;
                this.filter.level = null;
                this.filter.class = null;
            }
        },
        countCenters : function(id){
            const that = this;
            if(this.DataCountCenter != null && this.DataCountCenter.find(o=>o.id == id) != undefined) return this.DataCountCenter.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Center.find(o=>o.id == id) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Center.push({id:id});
                var result = Helper.countCenters(id,this.start,this.end);
                result.then(res=>{
                    that.DataCountCenter.push({id:id,value:res.data});
                    that.DataLoadDing.Center.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id),1);
                })

                return '<div>...</div>'; 
            }
        },
        countClass : function(id,type){
            const that = this;
            if(this.DataCountClass != null && this.DataCountClass.find(o=>o.id == id) != undefined) return this.DataCountClass.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Class.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Class.push({id:id,type:type});
                var result = Helper.countClass(id,type,this.start,this.end);
                result.then(res=>{
                    that.DataCountClass.push({id:id,value:res.data.n});
                    that.DataLoadDing.Class.splice(that.DataLoadDing.Class.findIndex(o=>o.id == id && o.type == type),1);
                    that.ListClassData.push({id:id,type:type,l:res.data.l});
                    that.loadDataByClass(res.data.l,id,type,0);
                })
                return '<div>...</div>'
            }
        },
        loadDataByClass : function(listClass,id,type,i){
            const that = this;
            if(listClass != null && listClass.length > 0 && i < listClass.length)
            {
                that.loadBaiGiao(listClass[i],id,type)
                .then(res=>{ that.DataGiaoBai.push(res.data);})
                .catch(err=>{console.log(err);})
                .finally(()=>{
                    if(i < listClass.length){
                        i++;
                        return that.loadDataByClass(listClass,id,type,i);
                    }
                })
            }
        },
        loadBaiGiao : function(classid,id,type){
            return Helper.GetBaiGiao(classid,id,type,this.start,this.end);
        },
        loadTuLuyen : function(classid,id,type){
            console.log(classid,id,type);
        },
        loadLink : function(classid,id,type){
            console.log(classid,id,type);
        },
        countStudents : function(id,type){
            const that = this;
            if(this.DataCountStudents != null && this.DataCountStudents.find(o=>o.id == id) != undefined) return this.DataCountStudents.find(o=>o.id == id).value;
            else{
                if(this.DataLoadDing.Student.find(o=>o.id == id && o.type == type) != undefined) return '<div> đang load </div>';
                this.DataLoadDing.Student.push({id:id,type:type});
                var result = Helper.countStudents(id,type,this.start,this.end);
                result.then(res=>{
                    that.DataCountStudents.push({id:id,value:res.data});
                    that.DataLoadDing.Student.splice(that.DataLoadDing.Student.findIndex(o=>o.id == id && o.type == type),1);
                })
                return '<div>...</div>'
            }
        },
        changeFilterDate : function(date){
            if(date && date.length > 1 && date[0] && date[1]){
                this.start = date[0].getFullYear()+"-"+(date[0].getMonth()+1)+"-"+date[0].getDate();
                this.end = date[1].getFullYear()+"-"+(date[1].getMonth()+1)+"-"+date[1].getDate();
            }
            else{
                this.start = null;
                this.end = null;
            }
        }
    }
})

</script>