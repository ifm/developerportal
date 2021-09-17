<?php 

include('Parsedown.php');
$Parsedown = new Parsedown();

//Get Provided URL, verify its a github url, and parse the url to markdown
$contents_url = 'https://raw.githubusercontent.com//ifm/documentation/lm_table_of_content/O3R/README.md';
$parse_contents_url = parse_url($contents_url);
$path_array = explode('/',$parse_contents_url['path']);


//Get parts of the path array, and set base_info
$base_info['base_url'] = $parse_contents_url['scheme'].'://'.$parse_contents_url['host'];
$base_info['base_username'] = $path_array[1];
$base_info['base_repo_name'] = $path_array[2];
$base_info['base_repo'] = $base_info['base_username'] . '/' .  $base_info['base_repo_name'];
$base_info['base_branch'] = $path_array[3];

//If Path array is > 4, set base_sub_folder to the 4th path,
if(count($path_array) > 4){
    $base_info['base_sub_folder'] = $path_array[4];
}

//Set Base File, to the last, and set base_full_url;
$base_info['base_file'] = end($path_array);
$base_info['base_full_url'] = $base_info['base_url'].'/'.$base_info['base_repo'].'/'.$base_info['base_branch'].'/'.$base_info['base_sub_folder'].'/'; 

//Get Markdown from Base Url
$md = return_md($contents_url,$Parsedown);

//Build Json array from the gitub repo and echo it.
$json_array['items'] = rec_md_get($md, $base_info,$Parsedown);
// header('Content-Type: application/json');
// echo json_encode($json_array);

$json = json_encode($json_array);
$file = fopen('../jquery/menu.json','w+') or die("File not found");
fwrite($file, $json);
fclose($file);

//Gets the string between two other strings inside of a string.
function get_string_between($string, $start, $end){
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

//Check if url is github.
function check_for_github_url($url){
    if(is_array($url)){
        if(in_array('github.com',$url)){
            return true;
        }else{
            return false;
        }
    }else{
        if (strpos($url, 'github.com') !== false) {
            return true;
        }else{
            return false;
        }
    }
    
}

//Recursive function to get md, and build menu array.
function rec_md_get($md,$base_info,$Parsedown){

    //Set Vars
    $return_array = array();
    $items_array = array();
    
    //Get Table of Contents from Markdown and remove just the list items
    $table_of_contents = get_string_between($md, '<table>', '</table>');
    $table_of_contents_list = explode('<td>',$table_of_contents);

    //Loop through the list items, and buid an array to create the json from
    foreach ($table_of_contents_list as $list_item) {
        

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

        //Get List Item text and set to name. Remove Some extra data from the list item (</li>). And get the url from the list item.
        $item_name = get_string_between($list_item,'">','</');
        $list_item = str_replace('</td>','',$list_item);
        $list_item_url = get_string_between($list_item,'href="','"');
        
        //If List Item Url is linking to a MD file, else set it to an external file.
        if(strpos($list_item_url,'.md') !== false){

            //Set Vars
            $item_type = 'doc_readme';
            $md_url = '';

            if(check_for_github_url($list_item_url) == false){
                //Break apart url and count the items
                $list_item_url_array = explode('/',$list_item_url);
                $list_item_url_array_count = count($list_item_url_array);
                $item_file = end($list_item_url_array);
                
                if($list_item_url_array_count > 1){

                    $list_array_slice = array_slice($list_item_url_array, 0, -1);
                    $item_url = end($list_item_url_array);
                    $list_item_array_string = implode("/", $list_array_slice);
                    
                    $base_info['parent_folder'] = $list_item_array_string;
                    $item_sub_folder = $base_info['base_sub_folder'].'/'.$base_info['parent_folder'];

                    $item_repo = $base_info['base_repo'];
                    $item_branch = $base_info['base_branch'];
                    
                }else{
                    $item_sub_folder = $base_info['base_sub_folder'].'/'.$base_info['parent_folder'];
                    $item_url = $list_item_url;
                    $item_repo = $base_info['base_repo'];
                    $item_branch = $base_info['base_branch'];
                }
            }else{           
                $parse_list_item_url = parse_url($list_item_url);
                $path_array = explode('/',$parse_list_item_url['path']);

                $item_repo = $path_array[1] . '/' .  $path_array[2];
                $item_branch = $path_array[4];
                $item_sub_folder = $path_array[5];
                $item_file = end($path_array);

            }
            
            $md_url = $base_info['base_url'].'/'.$item_repo.'/'.$item_branch.'/'.$item_sub_folder.'/'.$item_file;
            

            //Get Markdown from url
            $md = return_md($md_url,$Parsedown);

            //Get this items children/do recersive to children
            $item_children = rec_md_get($md, $base_info,$Parsedown);

            if($item_children){
                $item_has_children = true;
            }else{
                $item_has_children = false;
            }

        }else{
            $item_url = $list_item_url;
            $item_type = 'ex';
        }

        //Set all the needed $item_array vars
        $item_array['name'] = $item_name;
        $item_array['type'] = $item_type;


        if($item_type != 'ex'){
            $item_array['repo'] = $item_repo;
            $item_array['branch'] = $item_branch;
            $item_array['subfolder'] = $item_sub_folder;
            $item_array['file'] = $item_file;
        }else{
            $item_array['url'] = $item_url;
        }
        
        if($item_has_children){
            $item_array['has_children'] = $item_has_children;
            $item_array['children'] = $item_children;
        }
        

        //Add this $item_array to the list of all items $items_array
        if($item_name != ''){
            array_push($items_array, $item_array);
        }
        
    }

    //Return all the items $items_array
    return $items_array;

}

//Gets the MD and retunrs it.
function return_md($url,$Parsedown){
    
    $contents = file_get_contents($url);
    $md = $Parsedown->text($contents);

    return $md;
}


?>