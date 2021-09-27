<?php 

$debug = true;

include('Parsedown.php');
$Parsedown = new Parsedown();

//Get Provided URL, verify its a github url, and parse the url to markdown
$base_md_file = 'https://raw.githubusercontent.com/Costellos/Ifm-documentation-test/master/documentation/README.md';
$parse_contents_url = parse_url($base_md_file);
$path_array = explode('/',$parse_contents_url['path']);

//Get parts of the path array, and set base_info
$base_info['base_url'] = $parse_contents_url['scheme'].'://'.$parse_contents_url['host'];
$base_info['base_username'] = $path_array[1];
$base_info['base_repo_name'] = $path_array[2];
$base_info['base_repo'] = $base_info['base_username'] . '/' .  $base_info['base_repo_name'];
$base_info['base_branch'] = $path_array[3];
$base_info['base_file'] = end($path_array);
$base_info['temp_parent_folder'] = '';

//If Path array is > 4, set base_sub_folder to the 4th path and then define base_full_url
if(count($path_array) > 4){
    $base_info['base_sub_folder'] = $path_array[4];
    $base_info['base_full_url'] = $base_info['base_url'].'/'.$base_info['base_repo'].'/'.$base_info['base_branch'].'/'.$base_info['base_sub_folder'];
}else{
    $base_info['base_full_url'] = $base_info['base_url'].'/'.$base_info['base_repo'].'/'.$base_info['base_branch'];
}

$main_md = return_md($base_md_file,$Parsedown);

$json_array['items'] = rec_build_array($base_info,$main_md,$Parsedown);

if($debug == true){
    //Debug json data
    echo('<br /><br />');
    $json = json_encode($json_array);
    echo($json);
}else{
    //write to file
    $json = json_encode($json_array);
    $file = fopen('../menu.json','w+') or die("File not found");
    fwrite($file, $json);
    fclose($file);
}


function rec_build_array($base_info,$md,$Parsedown){
    $items_array = array();

    echo($md);

    $table_check = check_for_table($md);


    if($table_check){

        $main_table = get_string_between($md, '<table>', '</table>');
        $main_table_body = get_string_between($main_table, '<tbody>', '</tbody>');
        $main_table_body_list = explode('<td>',$main_table_body);
        array_shift($main_table_body_list);

        foreach ($main_table_body_list as $list_item) {
            
            $list_item = str_replace('</td>','',$list_item);
            
            //Set Vars
            $item_array = array();
            $item_url = '';
            $item_name = '';
            $item_has_children = '';
            $item_sub_folder = '';
            $item_type = '';
            $item_repo = '';
            $item_branch = '';
            $item_file = '';
            $item_parent_folder = '';

            $item_name = get_string_between($list_item,'">','</');
            $list_item_url = get_string_between($list_item,'href="','"');

            //If List Item Url is linking to a MD file, else set it to an external file.
            if(strpos($list_item_url,'.md') !== false){

                //Set Vars
                $item_array['name'] = $item_name;
                $item_type = 'doc_readme';

                $list_item_url_array = explode('/',$list_item_url);
                $list_item_url_array_count = count($list_item_url_array);


                //Test count of link folder sturcure (3 is base root, 2, is sub folder Readme (i.e. Paramaters/README.md), 1 is sub folder file (i.e. Paramaters/modes.md))
                // if($list_item_url_array_count >= 3){

                //     $item_parent_folder = $list_item_url_array[0];

                //     $item_file = $base_info['base_full_url'] . '/'. $list_item_url;

                // }elseif($list_item_url_array_count == 2){

                //     $item_parent_folder = $list_item_url_array[0];

                //     $item_file = $base_info['base_full_url'] . '/'. $list_item_url;

                // }elseif($list_item_url_array_count == 1){
                //     $item_parent_folder = $base_info['temp_parent_folder'];
                //     $item_file = $base_info['base_full_url'] . '/'. $item_parent_folder . '/'. $list_item_url;
                // }

                

                echo($item_file);

                $item_repo = $base_info['base_repo'];
                $item_branch = $base_info['base_branch'];

                $item_array['has_children'] = $item_has_children;
                $item_array['sub_folder'] = $item_sub_folder;
                $item_array['type'] = $item_type;
                $item_array['repo'] = $item_repo;
                $item_array['branch'] = $item_branch;
                $item_array['file'] = $item_file;
                $item_array['parent_folder'] = $item_parent_folder;
                $base_info['temp_parent_folder'] = $item_parent_folder;

                $md = return_md($item_file,$Parsedown);

                $children = rec_build_array($base_info,$md,$Parsedown);
                if($children){
                    $item_has_children = true;
                }
                
            }else{
                $item_array['name'] = $item_name;
                $item_type = 'ex';
                $item_url = $list_item_url;
            }

            //Push item array to all items array for json encoding
            array_push($items_array, $item_array);        
        }

        return $items_array;
    }else{
        return false;
    }

    
}


//Gets the string between two other strings
function get_string_between($string, $start, $end){
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}


//Gets the MD and returns it.
function return_md($url,$Parsedown){
    
    $contents = file_get_contents($url.'');
    $md = $Parsedown->text($contents);

    return $md;
}

function check_for_table($md){
    $table_check = get_string_between($md, '<table>', '</table>');
    
    if(strpos($table_check, 'Table of content') !== false){
        $table_check = true;
    }else{
        $table_check = false;
    }

    return $table_check;
}

?>