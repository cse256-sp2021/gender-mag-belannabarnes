// ---- Define your dialogs  and panels here ----
let effectivePermPanel = define_new_effective_permissions("permId", true);;
let welcome = document.createElement("h1");
welcome.innerText = "Welcome! This is a File Permissions interface.";
let intro = document.createElement("h2");
intro.innerText="Here's some things you should know: ";
introList1 = document.createElement("li");
introList1.innerText="Your goal is to give a user(s) the certain permissions for the certain file/folder listed in the mTurk banner below in 3 minutes or less.";
introList2 = document.createElement("li");
introList2.innerText="The folders/files are to your left.";
introList3 = document.createElement("li");
introList3.innerText="If a folder is not mentioned/hinted at in the instructions, chances are you will not need to open it.";
$('#sidepanel').append(welcome);
$('#sidepanel').append(intro);
$('#sidepanel').append(introList1);
$('#sidepanel').append(introList2);
$('#sidepanel').append(introList3);

let distinction = document.createElement("h4");
distinction.innerText = "Note: Grey boxes are inherited permissions and are NOT clickable. Blue boxes are explicit and are clickable. Blank boxes are also clickable.";
let disclaimer = document.createElement("h4");
disclaimer.innerText="**Clicking Deny overrides Allow.**";
$('#perm_add_user_line').append(distinction);
$('#perm_add_user_line').append(disclaimer);
let permDirection = document.createElement("h4");
permDirection.innerText="Select a user below to see their permissions.";
$('#permdialog_objname').append(permDirection);
$(`#permdialog_grouped_permissions_Modify_name`).text('Modify (will also select Write)')
$(`#permdialog_grouped_permissions_Read_Execute_name`).text('Read_Execute (will also select Read)')
$(`#permdialog_grouped_permissions_Full_control_name`).text('Full_Control (will also select all of the above)')



// $('#sidepanel').append(effectivePermPanel);
// let userSelectField = define_new_user_select_field("userSelectId", "Select User");
// $('#sidepanel').append(userSelectField);

// let dialog = define_new_dialog();
// $('#sidepanel').append(dialog);
// $('.perm_info').click(function(){
//     // console.log('clicked');
//     console.log($('#permId').attr('filepath'));
//     let fileObject = path_to_file[$('#permId').attr('filepath')];
//     console.log($('#permId').attr('username'));
//     let userObject = all_users[$('#permId').attr('username')];
//     let check = allow_user_action(fileObject, userObject, $(this).attr('permission_name'), true);
//     let explanationText = get_explanation_text(check);
//     console.log($(this));
//     dialog.text(explanationText);
// })

// $('#permId').attr('filepath', '/C/presentation_documents/important_file.txt');
// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                    View Permissions for this Folder
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                View Permissions for this File
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 