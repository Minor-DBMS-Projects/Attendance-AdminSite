import React, { useState, useContext, useEffect } from 'react';
import {withRouter } from 'react-router-dom';
import ApiRequest from '../ApiRequest';
import {AuthContext} from "../../../contexts/authContext";
function EditUser(props) {
  const [authenticated, setAuthenticated]=useContext(AuthContext);
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [dept, setDept] = useState('');
  const [savedDepartments, setSavedDepartments] = useState([]);

  useEffect(() => {
    async function getUser() {
      const request = await ApiRequest.get(`/instructor/${props.match.params._id}`);
      setName(request.data[0].name);
      setUser(request.data[0].code);
      setDept(request.data[0].department_id);
    };
    async function getDepartments() {
      const requestDepartments = await ApiRequest.get('/department');
      setSavedDepartments(requestDepartments.data);
    };
    getUser();
    getDepartments();
  }, [props.match.params._id]);

  const submitForm = (e) => {
    e.preventDefault();
    const data = {
      username:name,
      code:user,
      dept:dept,
      id:props.match.params._id
    }
    ApiRequest.post('/secret/edit-user', data).then(()=>props.history.push("/home")).catch((err)=>
    {
     if (err.response.status==401)
     alert("You must be logged in to perform this action")
     setAuthenticated(false)
    });
  };

  return(
    <React.Fragment>
      <div className="card mx-auto my-5 text-center" style={{maxWidth: "20rem"}}>
        <div className="card-header">Edit User</div>
        <div className="card-body">
          <form>
            <input type="text" className="form-control mb-3" placeholder="Name" value={name} onChange={ e => setName(e.target.value) }></input>
            <input type="text" className="form-control mb-3" placeholder="Username" value={user} onChange={ e => setUser(e.target.value) }></input>
            <select className="form-control mb-3" onChange={ e => setDept(e.target.value)}>
              <option style={{display:"none"}}>Department</option>
              { savedDepartments.map(dept =>
                <option value={dept.id} key={dept.id}>{dept.name}</option>
              )}
            </select>
           <button type="submit" className="btn btn-primary btn-block" onClick={ submitForm }>Edit User</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  )
};

export default withRouter(EditUser);