(function($) {
    //Set Default Vars
    var docapi_container = $('.docapi');
    var raw_url = 'https://raw.githubusercontent.com';
    var repo = docapi_container.attr('data-repo');
    var branch = docapi_container.attr('data-branch');
    var subfolder = docapi_container.attr('data-subfolder');
    var rd_file = docapi_container.attr('data-file');

    var frame = document.getElementById("mainframe");

    frame.onload = function() {
        frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
        frame.style.width = frame.contentWindow.document.body.scrollWidth + 'px';
    }
    
    //Get menu.json. loop through each item, and build the menu items out of that.(Might breakdown more for modulary and clarity in future).
    $.getJSON("jquery/menu.json", function(data){

        var docapi_menu = $('.docapi_menu_con');

        var html = '<ul class="docapi_menu"><li class="docapi_menu_link" data-hash="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'"><a class="in_load active" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+rd_file+'" href="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'">Overview</a></li>';
        
        //Loop through data.items and for each onme, build the menu.
        $.each(data.items, function() {

            //Set name, type and default all item_has_children to false, we set it to true later if it has children.
            var name = this.name;
            var type = this.type;
            var item_has_children = false;

            //If type is not ex. Set file, repo, and branch to the data.
            if(type != 'ex'){
                var file = this.file;
                var repo = this.repo;
                var branch = this.branch;

                //This builds the folder structure starting at the repo subfolder, and adding parent folder if it has one.
                if(this.subfolder != ''){
                    //If item has partent 
                    if(this.parent_folder != ''){
                        var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                    }else{
                        var subfolder = this.repo_sub_folder;
                    }
                }else{
                    var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                }

                //If it has_children, set vars for children and set item_has_children to true
                if(this.has_children == true){
                    var item_has_children = this.has_children;
                    var children = this.children
                }else{
                    var item_has_children = false;
                    var children = '';
                }
                
                //If item_has_children then setup the sub folder items
                if(item_has_children){
                    html += '<li class="docapi_menu_link has_children" data-hash="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'">';
                }else{
                    html += '<li class="docapi_menu_link" data-hash="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'">';
                }
                
                //Start recursive loop down.
                html += buildDocItem(name,repo,branch,subfolder,file,item_has_children,children);
                html += '</li>';

            //If item type is ex, build the ex item menu.
            }else{
                var url = this.url;

                html += '<li>';
                html += buildExItem(name,url);
                html += '</li>';
            }

            
        });

        html += '</ul>';

        //Add html from above to the docapi menu.
        docapi_menu.html(html);

    }).fail(function(){
        console.log("An error has occurred.");
    });


    //On document ready (needed to do this after the menu is build from above) to checks if it has a hash, if it does a the has, if it doesnt load the defalts set at top.
    $( document ).ready(function() {
        //If Has hash, set vars and load has, else load default settings.
        if(window.location.hash) {
            
            var hash = window.location.hash;

            console.log(hash);
            
            var hashObj = getHashObj(hash);

            loadMarkdown(raw_url,hashObj.hash_repo,hashObj.hash_branch,hashObj.hash_subfolder,hashObj.hash_file);

            loadHash(hashObj);

        }else{
            loadMarkdown(raw_url,repo,branch,subfolder,rd_file);
        }
    });

    //On hashchage, parse hash and load markdown
    $(window).on('hashchange', function(){

        var hash = window.location.hash;

        var hashObj = getHashObj(hash);
        
        if(hash){
            loadMarkdown(raw_url,hashObj.hash_repo,hashObj.hash_branch,hashObj.hash_subfolder,hashObj.hash_file);
        }else{
            loadMarkdown(raw_url,repo,branch,subfolder,rd_file);
        }
        
    });

    
    // On click of link inline, prevent default action get link parts, and set the hash. (On Hash Change will load the new url)
    $(document).on("click",".inline_md_file",function(e){
        e.preventDefault();

        var link = $(this);
        
        var link_repo = link.attr('data-repo');
        var link_branch = link.attr('data-branch');
        var link_subfolder = link.attr('data-subfolder');
        var link_file = link.attr('data-file');

        var hash_check = "#"+repo+'/'+branch+'/'+subfolder+'/'+rd_file;

        location.hash = [link_repo,link_branch,link_subfolder,link_file].join('/');


    });

    //On menu item click, check to see if link in in submenu, if not, open submenu if it has one and close all others.
    $(document).on('click',".docapi_menu_link",function(e){
        e.stopPropagation();

        console.log('DocApi Menu Click');

        $('.docapi_menu').find('a.in_load').removeClass('active');
        $(this).find('> a.in_load').addClass('active');

        //If this item has children
        if($(this).hasClass('has_children')){
            var link_sub_menu =  $(this).children('.sub_menu');
            var other_sub_menus = $(this).siblings('.docapi_menu_link');
            
            //Close other sub menus
            other_sub_menus.each(function(){
                var other_sub_menu =  $(this).children('.sub_menu');
                closeMenu(other_sub_menu);
            });

            //Open this sub menu
            openMenu(link_sub_menu);
        }else{
            var other_sub_menus = $(this).siblings('.docapi_menu_link');
            
            other_sub_menus.each(function(){
                var other_sub_menu =  $(this).children('.sub_menu');
                closeMenu(other_sub_menu);
            });
        }

    });

    //Load hash and open the current menu that = the hash. (WIP)
    function loadHash(hashObj){

        var current_hash = "#"+hashObj.hash_repo+"/"+hashObj.hash_branch+"/"+hashObj.hash_subfolder+"/"+hashObj.hash_file;

        console.log(current_hash);

        var items = $(".docapi_menu_link");

        items.each(function(){
            var test = $(this).find(`[data-hash='${current_hash}']`);
            
            if(test.length > 0){
                //console.log("Hash Found");
                $(this).click();
            }else{
                //console.log("Hash Not Found");
            } 
        });

        //console.log(items.length);
    }

    //Function to close the menu on click
    function closeMenu(item){
        
        var parent_li = item.parent('.docapi_menu_link');
        var all_parent_sub_menus = parent_li.find('.sub_menu');

        all_parent_sub_menus.each(function(){
            $(this).slideUp( "fast", function() {});
            $(this).removeClass('open');
        });
        
        item.slideUp( "fast", function() {});
        item.removeClass('open');

    }

    //Function to open the menu on click
    function openMenu(item){

        if(item.hasClass('open')){
            closeMenu(item);
        }else{
            item.slideDown( "fast", function() {});
            item.addClass('open');
        }
        
    }

    //Function to build readme items in the menu.
    function buildDocItem(name,repo,branch,subfolder,file,item_has_children,children){

        var html = '';

        var href = '#'+repo+'/'+branch+'/'+subfolder+'/'+file;''
        
        //Create link, and fill with data provided
        html += '<a class="in_load" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+file+'" href="'+href+'">'+name+'</a>';
        
        //If item has children, loop through them, and build the sub items
        if(item_has_children){
            html += '<ul class="sub_menu">';
            
            //Loop children, and set vars.
            $.each(children, function() {
                
                var name = this.name;
                
                var type = this.type;

                if(type != 'ex'){
                    if(this.subfolder != ''){
                        if(this.parent_folder != ''){
                            var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                        }else{
                            var subfolder = this.repo_sub_folder;
                        }
                    }else{
                        var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                    }

                    var file = this.file;
    
                    if(this.has_children != false){
                        item_has_children = this.has_children;
                    }
                    
                    //If item has children, set children = children, and build sub menu, else set children to blank array, aand setup for no more sub items.
                    if(item_has_children){
                        html += '<li class="docapi_menu_link has_children" data-hash="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'">';
                        var children = this.children;
                    }else{
                        html += '<li class="docapi_menu_link" data-hash="#'+repo+'/'+branch+'/'+subfolder+'/'+rd_file+'">';
                        var children = [];
                    }
                    //Continue recursive
                    html += buildDocItem(name,repo,branch,subfolder,file,item_has_children,children);
                    html += '</li>';
                //If type is ex, build ex item.
                }else{
                    var url = this.url;
                    html += '<li>';
                    html += buildExItem(name,url);
                    html += '</li>';
                }
                
            });

            html += '</ul>';
        }

        //Return the html
        return html;
    }

    //Function to build external link items in the menu.
    function buildExItem(name,url){
        var html = '';

        html += '<a href="'+url+'" target="_blank">'+name+'</a>';

        return html;
    }

    //Function to get markdown from url.
    function getMarkdown(url) {
        var result="";
        $.ajax({
            url:url,
            async: false,  
        })
        .done(function(data){
            result = data;
        })
        .fail(function(){
            result = '### There was an error loading that file. Please try again later or contact the site administrator.';
        });
        return result;
    }

    //Hash parser
    function getHashObj(hash_str){

        var hash_array = {};
        
        var hashObj = hash_str.split('/');
        var hash_username = hashObj[0].replace('#','');
        var hash_repo_name = hashObj[1];
        var hash_repo = hash_username + '/' + hash_repo_name;
        var hash_branch = hashObj[2];
        var hash_file = hashObj.slice(-1).pop();

        var remove_first = hashObj.slice();
        remove_first.splice(0,3);
        var remove_last = remove_first.slice();
        remove_last.splice(-1,1);
        var hash_subfolder = remove_last.join("/");

        hash_array.hash_repo = hash_repo;
        hash_array.hash_branch = hash_branch;
        hash_array.hash_subfolder = hash_subfolder;
        hash_array.hash_file = hash_file;

        return hash_array;

    }

    //Function to fetch and load markdown from url.
    function loadMarkdown(base_url,base_repo,base_branch,base_subfolder,base_rd_file){

        if(base_subfolder != ''){
            var md_url = [ base_url, base_repo, base_branch, base_subfolder, base_rd_file ].join('/');
            var load_path = [ base_url, base_repo, base_branch, base_subfolder ].join('/');
            var load_subfolder = base_subfolder;
        }else{
            var md_url = [ base_url, base_repo, base_branch, base_rd_file ].join('/');
            var load_path = [ base_url, base_repo, base_branch ].join('/');
        }

        var docapi_content = $('.docapi_content');
        docapi_content.empty();
        var markDown = getMarkdown(md_url);
        var md = window.markdownit();

        // Change Links to absolute paths, and add class 'inline_md_file';
        var defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };
        md.renderer.rules.link_open = function (tokens, idx, options, env, self) {

            //Get Href of each inline link
            var aIndex = tokens[idx].attrIndex('href');
            var current_href = tokens[idx].attrs[aIndex][1];

            //If link contains .md add, full url, add class, and add data attributes
            if (current_href.indexOf(".md") >= 0){


                //if url is folder behind, change subfolder, and current href
                if(current_href.indexOf("../") >= 0){
                    var temp_subfolder_array = load_subfolder.split("/");
                    var subfolder_array = temp_subfolder_array.slice(0,-1)
                    load_subfolder = subfolder_array.join('/');
                    current_href = current_href.replace("../", "");
                }

                //Define new_href
                var new_href = load_path + '/' + tokens[idx].attrs[aIndex][1];
                tokens[idx].attrs[aIndex][1] = new_href;    // replace value of existing attr
                tokens[idx].attrPush(['class', 'inline_md_file']); // add new attribute

                tokens[idx].attrPush(['data-repo', repo]); // add new attribute
                tokens[idx].attrPush(['data-branch', branch]); // add new attribute
                if(load_subfolder){
                    tokens[idx].attrPush(['data-subfolder', load_subfolder]); // add new attribute
                }else{
                    tokens[idx].attrPush(['data-subfolder', '' ]); // add new attribute
                }
                
                tokens[idx].attrPush(['data-file', current_href]); // add new attribute
            }
            // pass token to default renderer.
            return defaultRender(tokens, idx, options, env, self);
        };

        var defaultRender2 = md.renderer.rules.image || function(tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        md.renderer.rules.image = function (tokens, idx, options, env, self) {

            //Get Href of each inline link
            var aIndex = tokens[idx].attrIndex('src');
            var new_src = load_path + '/' + tokens[idx].attrs[aIndex][1];
            tokens[idx].attrs[aIndex][1] = new_src;    // replace value of existing attr
            tokens[idx].attrPush(['class', 'md_image']); // add new attribute



            return defaultRender2(tokens, idx, options, env, self);
        };

        var html = md.render(markDown);
        docapi_content.html(html);


        //If file is readme hide the table if it contains the words "table of content" in the thead
        var file_check = base_rd_file.toLowerCase();

        if(file_check.indexOf("readme")  !== -1){
            $(".docapi_content table").each( function (el) {
                var the_table = $(this); // table
                $(this).children().each(function () { // thead
                    $(this).children().each(function () { //tr
                        $(this).children().each(function () { //th
                            var text = $(this).text();
                            text = text.toLowerCase();
                            if (text.indexOf("table of content") !== -1 ) {
                                the_table.hide();
                            }
                        });
                    });
                });
            });
        }
    }

}(jQuery))
