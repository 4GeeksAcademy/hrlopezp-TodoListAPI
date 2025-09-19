import "../../styles/home.css"
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from "react"

const notify = () => toast('¡Debes ingresar una nueva tarea!');
const URL_base = ("https://playground.4geeks.com/todo/")
const inicioTarea = { label: "", done: true }

const Home = () => {
	 const [escribirTarea, setEscribirTarea] = useState(inicioTarea)
    const [guardarTarea, setGuardarTarea] = useState([])
    const [filter, setFilter] = useState("all")


    const filterTask = guardarTarea.filter((item) => {
        if (filter === "all") return true;
        if (filter === "active") return !item.is_done
        if (filter === "completed") return item.is_done
    })


    function handleChange(event) {
        setEscribirTarea({
            ...escribirTarea,
            [event.target.name]: event.target.value,
        })
    }


    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!escribirTarea.label) {
            notify();
            return
        }

        const response = await fetch(`${URL_base}todos/hrlopezp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(escribirTarea)
        })

        if (response.ok) {
            getAllTask()
        }
        setEscribirTarea(inicioTarea)
    }


    const deleteTarea = async (id) => {
        try {
            const response = await fetch(`${URL_base}todos/${id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getAllTask = async () => {
        try {
            const response = await fetch(`${URL_base}users/hrlopezp`)
            const data = await response.json()

            if (response.ok) {
                setGuardarTarea(data.todos)
            } else if (response.status == 404) {
                createUser()
            } else {
                throw new Error("Error")
            }
        } catch (error) {
            console.log(error)
        }

    }

    const createUser = async () => {
        try {
            const response = await fetch(`${URL_base}users/hrlopezp`, {
                method: "POST"
            })
            if (response.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUser = async () => {
        try {
            const response = await fetch(`${URL_base}users/hrlopezp`, {
                method: "DELETE",
            })
            if (response.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }


    const listear = async (data) => {
        try {
            const response = await fetch(`${URL_base}todos/${data.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    is_done: !data.is_done
                })
            })
            if (response.ok) {
                getAllTask()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllTask()
    }, [])


    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-7">
                        <h1 className="display-1 text-danger text-center py-3">todos</h1>
                        <Toaster />
                    </div>
                    <div className="col-12 col-md-7">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Ingresa una tarea nueva"
                                name="label"
                                className="w-100 fs-2 ps-5 py-2 border sombra"
                                value={escribirTarea.label}
                                onChange={handleChange}
                            />
                        </form>
                    </div>
                    <div className="col-12 col-md-7">
                        {
                            filterTask.map((item) => {
                                return (
                                    <div key={item.id} className="tarea-completa d-flex justify-content-between border border-top-0 fs-2 ps-5 py-2 bg-white sombra texto-color">
                                        <p className="m-0 p-0">{item.label}</p>
                                        <div className="d-flex mx-4 gap-4">
                                            <span>
                                                <input
                                                    className="ocultar"
                                                    type="checkbox"
                                                    checked={item.is_done}
                                                    onChange={() => listear(item)}
                                                />
                                            </span>
                                            <span>
                                                <button
                                                    className="ocultar bg-white border border-0 text-danger"
                                                    onClick={() => deleteTarea(item.id)}
                                                >x</button>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div className="col-12 col-md-7">
                        <div className="border border-top-0 p-0 m-0 bg-white shadow texto-color">
                            <p className="m-0 py-2 px-3">{filterTask.length} {filterTask.length === 0 || filterTask.length === 1 ? "item left" : "items left"}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="border border-top-0 mx-1 py-1 bg-white shadow"></div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="border border-top-0 mx-2 py-1 bg-white shadow"></div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="mt-5 d-flex justify-content-between">
                            <button
                                className={`btn btn-succes`}
                                onClick={() => setFilter("all")}
                            >Todas las tareas
                            </button>
                            <button
                                className={`btn btn-warnin`}
                                onClick={() => setFilter("active")}
                            >Tareas por cumplir
                            </button>
                            <button
                                className={`btn btn-primar`}
                                onClick={() => setFilter("completed")}
                            >Tareas finalizadas
                            </button>
                        </div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="d-flex justify-content-center my-5 me-4">
                            <button
                                className="btn btn-dange"
                                onClick={deleteUser}
                            >Borrar todo</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Home;