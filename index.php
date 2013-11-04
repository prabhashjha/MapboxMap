      <?php
//---------------  WMS ----------------------------------
if($_GET['id'] == 'wms') {      
   $output= array(); $loop =0;
     
       $output[$loop] = array();
       $output[$loop]['url'] = "http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi";
       $output[$loop]['format'] ="image/png";
       $output[$loop]['transparent'] = "true";
       $output[$loop]['layer'] = "nexrad-n0r-900913";
       $output[$loop]['title'] = "Weather data © 2012 IEM Nexrad";
       $loop = $loop +1 ;      

 echo json_encode($output);
}

 ?>