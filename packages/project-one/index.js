import axios from "axios";

const addOne = (x=0,msg='未填') => {
    console.log(axios);
    console.log('调用project-one的项目是：',msg);
    return x + 1;
}
export default addOne