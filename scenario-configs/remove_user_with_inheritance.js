// Scenario: remove specified permission type(s) from a given user and file; but the permission is actually inherited from the folder

employees = ['employee1', 'employee2', 'employee3']

// equivalent to 'Read' and 'Modify' permission groups in baseline interface
read_modify_acl = [permissions.LIST, permissions.READ_ATTR, permissions.READ_EXTENDED_ATTR, permissions.READ_PERMS, permissions.WRITE_DATA, permissions.APPEND_DATA, permissions.WRITE_ATTR, permissions.WRITE_EXTENDED_ATTR, 
    permissions.DELETE, permissions.DELETE_SUB] 

docs_acl = make_crossjoin_acl(employees, read_modify_acl, true)

root_folder = make_file('C', 'administrator', parent=null, acl=make_full_access_acl('administrator'), using_permission_inheritance=false, is_folder=true);
docs = make_file('presentation_documents', 'employee1', parent=root_folder, acl=docs_acl, using_permission_inheritance=true, is_folder=true);
imp_file = make_file('important_file.txt', 'employee1', parent=docs, acl=[], using_permission_inheritance=true, is_folder=false);

files = [
    root_folder,
    docs,
    imp_file,
]