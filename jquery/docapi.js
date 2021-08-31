(function($) {
    
    //Set Default Vars
    var docapi_container = $('.docapi');
    var raw_url = 'https://raw.githubusercontent.com';
    var repo = docapi_container.attr('data-repo');
    var branch = docapi_container.attr('data-branch');
    var subfolder = docapi_container.attr('data-subfolder');
    var rd_file = docapi_container.attr('data-file');


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

        var children_menu_class = '';

        var docapi_menu = $('.docapi_menu');

        
        var html = '<ul><li><a class="in_load" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+rd_file+'" href="#">Overview</a></li>';
    
        $.each(data.items, function() {
            


            var name = this.name;

            var type = this.type;
            

            if(type != 'ex'){
                var subfolder = this.subfolder;
                var file = this.file;
                
                var repo = this.repo;
                var branch = this.branch;
                var subfolder = this.subfolder;

                if(this.has_children){
                    var has_children = this.has_children;
                    var children = this.children
                    var children_menu_class = 'sub_menu';
                }else{
                    var has_children = false;
                    var children = '';
                    var children_menu_class = '';
                }
                if(has_children){
                    html += '<li class="has_children">';
                }else{
                    html += '<li>';
                }
                
                html += buildDocItem(name,repo,branch,subfolder,file,has_children,children);
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

    $(document).on("click","li.has_children > a",function(e){
        var link_sub_menu =  $(this).siblings('.sub_menu');

        link_sub_menu.slideToggle( "fast", function() {});

        $(this).parent().toggleClass('open');
    });


    //Function to build readme items in the menu.
    function buildDocItem(name,repo,branch,subfolder,file,has_children,children){

        var html = '';

        var href = '#'+repo+'/'+branch+'/'+subfolder+'/'+file;
        
        html += '<a class="in_load" data-repo="'+repo+'" data-branch="'+branch+'" data data-subfolder="'+subfolder+'" data-file="'+file+'" href="'+href+'">'+name+'</a>';
        

        if(has_children){
            html += '<ul class="sub_menu">';
            
            $.each(children, function() {
                
    
                var id = this.id;
                var name = this.name;
    
                var type = this.type;
    
                if(type != 'ex'){
                    var subfolder = this.subfolder;
                    var file = this.file;
    
                    if(this.has_children){
                        var has_children = this.has_children;
                        var children = this.children
                    }else{
                        var has_children = false;
                        var children = '';
                    }
                    if(has_children){
                        html += '<li class="has_children">';
                    }else{
                        html += '<li>';
                    }
                    
                    html += buildDocItem(name,repo,branch,subfolder,file,type,has_children,children);
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
    function loadMarkdown(url,repo,branch,subfolder,rd_file){

        if(subfolder != ''){
            url = [ url, repo, branch, subfolder, rd_file ].join('/');
        }else{
            url = [ url, repo, branch, rd_file ].join('/');
        }

        var docapi_content = $('.docapi_content');
        docapi_content.empty();


        var markDown = getMarkdown(url);
        var md = window.markdownit();
        var html = md.render(markDown);
        docapi_content.html(html);

    }

}(jQuery))
