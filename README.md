jQuery.easyui-extend
====================
基于jQuery.easyui 1.3+ 对部分组件扩展了额外属性和方法。目前已扩展的部分组件如下：<br>
<ul>
  <li>tabs</li>
  <li>menu</li>
  <li>combo</li>
  <li>combobox</li>
  <li>datagrid</li>
  <li>window</li>
</ul>
要想扩展属性生效，必须执行方法followCustomHandle。<br>


例如：    
###  
    $('#cc').combo({
       required: true,
       editable: false,
       customAttr:{
          headervalue: '--请选择--'
       }
    }).combo('followCustomHandle');    



如要查看demo演示，请将所有文件放到jQuery.easyui解压后的根目录中。   


演示地址：http://loafer.cloudfoundry.com/    
Blog：http://blog.csdn.net/zjh527
