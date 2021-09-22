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

    //If Has hash, set vars and load has, else load default settings.
    if(window.location.hash) {
        
        var hash = window.location.hash;
        var hashObj = hash.split('/');
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

        loadMarkdown(raw_url,hash_repo,hash_branch,hash_subfolder,hash_file);

    }else{
        loadMarkdown(raw_url,repo,branch,subfolder,rd_file);
    }
    
    //Get menu.json. loop through each item, and build the menu items out of that.(Might breakdown more for modulary and clarity in future).
    $.getJSON("jquery/menu.json", function(data){

        var docapi_menu = $('.docapi_menu');

        var html = '<ul><li><a class="in_load" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+rd_file+'" href="#">Overview</a></li>';
    
        $.each(data.items, function() {

            var name = this.name;

            var type = this.type;

            var item_has_children = false;

            if(type != 'ex'){
                var file = this.file;
                var repo = this.repo;
                var branch = this.branch;

                if(this.subfolder != ''){
                    if(this.parent_folder != ''){
                        var subfolder = this.repo_sub_folder + '/' + this.parent_folder + '/' + this.subfolder;
                    }else{
                        var subfolder = this.repo_sub_folder + '/' + this.subfolder;
                    }
                }else{
                    var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                }

                if(this.has_children == true){
                    var item_has_children = this.has_children;
                    var children = this.children
                }else{
                    var item_has_children = false;
                    var children = '';
                }
                if(item_has_children){
                    html += '<li class="has_children">';
                }else{
                    html += '<li>';
                }
                
                html += buildDocItem(name,repo,branch,subfolder,file,item_has_children,children);
                html += '</li>';

            }else{
                var url = this.url;

                html += '<li>';
                html += buildExItem(name,url);
                html += '</li>';
            }

            
        });

        html += '</ul>';

        docapi_menu.html(html);
    }).fail(function(){
        console.log("An error has occurred.");
    });

    //On Click, reload new markdown form repo.
    $(document).on("click",".in_load",function(e){
        //Set vars, set link to this link, set subfolder, and rd_file to readme file.
        var link = $(this);

        var link_repo = link.attr('data-repo');
        var link_branch = link.attr('data-branch');
        var link_subfolder = link.attr('data-subfolder');
        var link_file = link.attr('data-file');
        
        loadMarkdown(raw_url,link_repo,link_branch,link_subfolder,link_file);

    });

    $(document).on("click",".inline_md_file",function(e){
        e.preventDefault();

        var link = $(this);
        
        var link_repo = link.attr('data-repo');
        var link_branch = link.attr('data-branch');
        var link_subfolder = link.attr('data-subfolder');
        var link_file = link.attr('data-file');
        
        loadMarkdown(raw_url,link_repo,link_branch,link_subfolder,link_file);

    });

    $(document).on("click","li.has_children > a",function(e){
        var link_sub_menu =  $(this).siblings('.sub_menu');

        link_sub_menu.slideToggle( "fast", function() {});

        $(this).parent().toggleClass('open');
    });

    //Function to build readme items in the menu.
    function buildDocItem(name,repo,branch,subfolder,file,item_has_children,children){

        var html = '';

        var href = '#'+repo+'/'+branch+'/'+subfolder+'/'+file;''
        
        html += '<a class="in_load" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+file+'" href="'+href+'">'+name+'</a>';
    
        if(item_has_children){
            html += '<ul class="sub_menu">';
            
            $.each(children, function() {
                
                var name = this.name;
                
                var type = this.type;

                if(type != 'ex'){
                    if(this.subfolder != ''){
                        if(this.parent_folder != ''){
                            var subfolder = this.repo_sub_folder + '/' + this.parent_folder + '/' + this.subfolder;
                        }else{
                            var subfolder = this.repo_sub_folder + '/' + this.subfolder;
                        }
                    }else{
                        var subfolder = this.repo_sub_folder + '/' + this.parent_folder;
                    }

                    var file = this.file;
    
                    if(this.has_children != false){
                        item_has_children = this.has_children;
                    }
                    if(item_has_children){
                        html += '<li class="has_children">';
                        var children = this.children;
                    }else{
                        html += '<li>';
                        var children = [];
                    }
                    
                    html += buildDocItem(name,repo,branch,subfolder,file,item_has_children,children);
                    html += '</li>';
                }else{
                    var url = this.url;
                    html += '<li>';
                    html += buildExItem(name,url);
                    html += '</li>';
                }
                
            });

            html += '</ul>';
        }

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
        });
        return result;
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

    }

}(jQuery))