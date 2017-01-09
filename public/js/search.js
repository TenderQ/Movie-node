var pager = Vue.component('pager',{
    template:`
        <div class="pager">
            <ul>
                <li v-if="current>1" v-on:click="setpage(1)">首页</li>
                <li :class="{disabled: current==1}" v-on:click="setpage(current-1)">«</li>
                <li v-for="index in pages" :class="{active:index===current}" @click="setpage(index)">{{index}}</li>
                <li :class="{disabled: current==total}" v-on:click="setpage(current+1)">»</li>
                <li v-if="current<total" v-on:click="setpage(total)">末页</li>
            </ul>
            <div class="pager-group">
                <input type="text" v-model="inputval" v-on:keyup.enter="setinput"/>
                <button v-on:click="setinput" type="button">跳转</button>
            </div>
            <div class="pager-num">共{{total}}页</div>
        </div>
    `,
    props:["total","current"],
    methods:{
        //点击按钮换页，this.$parent是当前组件的父组件，即为 vm 对象
        setpage:function(index){
            if(index > 0 && index <= this.total){
                this.$parent.pageCurrent = index;
                this.inputval = index;
            }
        },
        //输入框跳转
        setinput:function(){
            this.inputval = parseInt(this.inputval);
            if(this.inputval > 0 && this.inputval <= this.total){
                this.setpage(this.inputval);
            }
        }
    },
    data:function(){
        return {inputval:this.current}
    },
    computed:{
        //计算属性，动态获取页码
        pages:function(){
            var pagesArr = [];
            if(this.total <= 5){
                for(let i = 1; i <= this.total; i++){
                    pagesArr.push(i)
                }
            }else{
                if(this.current <= 3){
                    for(let i = 1; i < 5; i++){
                        pagesArr = [1,2,3,4,5]
                    }
                }else{
                    if(this.total - this.current > 2){
                        pagesArr = [this.current-2,this.current-1,this.current,this.current+1,this.current+2]
                    }else{
                        for(let i = this.total-4;i<=this.total;i++){
                            pagesArr.push(i)
                        }
                    }
                }
            }
            return pagesArr;
        }
    }
});

var	pageCurrent = $("#pagerWrap").attr('pageCurrent');    
var vm = new Vue({
    el: '#pagerWrap',
    data:{
    	pageCurrent: pageCurrent,
    },
    watch:{
    	pageCurrent:function(){
      		var url = window.location.href;
      		var page = this.pageCurrent - 1;
      		window.location.href = url.split("&")[0]+"&p="+page;
        }
    }
})