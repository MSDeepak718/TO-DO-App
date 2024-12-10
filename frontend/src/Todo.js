import {useEffect,useState} from 'react';

export default function Todo() {

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [message,setMessage] = useState("");
    const [error,setError] = useState("");
    const [editId,setEditId] = useState(-1);
    const [editTitle,setEditTitle] = useState("");
    const [editDescription,setEditDescription] = useState("");
    const apiUrl = "http://localhost:8000";

    useEffect( () => {
        getItems()
    }, [])

    const handleSubmit = () => {
        setError("");
        if(title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl+"/todo",{
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res) => {
                if(res.ok) {
                    setTodos([...todos,{title,description}])
                    setMessage("Item Added Successfully");
                    setTimeout(() => {
                        setMessage("");
                    },3000)
                    setTitle("");
                    setDescription("");
                }
                else {
                    setError("Unable to create a Item");
                }
            })
        }
    }

    const handleDelete = (id) => {
        if(window.confirm("Are you sure want to delete?")) {
            fetch(apiUrl+"/todos/"+id, {
                method: "DELETE"
            })
            .then(()=> {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos)
            })
        }  
    } 

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    }

    const handleUpdate = (id) => {
        setError("");
        if(editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl+"/todo/"+editId,{
                method: "PUT",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({title: editTitle, description: editDescription})
            }).then((res) => {
                if(res.ok) {
                    const updatedTodos = todos.map((item)=> {
                        if(item._id === editId){
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setMessage("Item Updated Successfully");
                    setTimeout(() => {
                        setMessage("");
                    },3000)
                    setEditId(-1);
                }
                else {
                    setError("Unable to update the item");
                }
            })
        }
    }

    const getItems = () => {
        fetch(apiUrl+"/todo")
        .then((res) => res.json())
        .then((res) => {
            setTodos(res)
        })
    }

    return <>
        <div className="row p-3 bg-success text-light">
            <h1>To-Do Application</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text"/>
                <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text"/>
                <button className="btn btn-dark"  onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <ul className="list-group">
                {todos.map((item) => 
                    <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                    {editId===-1 || editId!==item._id ?
                        <>
                            <div className="d-flex flex-column">
                                <span className='fw-bold'>{item.title}</span>
                                <span>{item.description}</span>
                            </div>
                        </> :
                        <>
                            <div className="form-group d-flex gap-2">
                                <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"/>
                                <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text"/>
                            </div>
                        </>

                    }
                    <div className='d-flex gap-2'>
                        {editId===-1 || editId !== item._id ? <button className='btn btn-warning' onClick={()=> handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={()=> handleUpdate(item._id)}>Update</button>}
                        {editId===-1 || editId !== item._id ? <button className='btn btn-danger' onClick={()=> handleDelete(item._id)}>Delete</button> : <button className='btn btn-danger' onClick={()=> setEditId(-1)}>Cancel</button>}
                    </div>
                </li>
                )}
            </ul>
        </div>
    </>
}