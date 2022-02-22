import {Button, Card, Col, Container, Form, FormControl, InputGroup, ListGroup, Row, Table} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {api_delete, api_get, api_post, api_put} from "../../utils/fetch";
import {useParams, useNavigate} from "react-router-dom";
import Loading from "../../components/Loading";
import {LinkContainer} from "react-router-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faExternalLink, faTrash} from "@fortawesome/free-solid-svg-icons";


const Class = () => {

    const { name } = useParams();
    const navigate = useNavigate();
    const [ class_, setClass ] = useState(undefined);
    const [ classSubjects, setClassSubjects ] = useState(undefined);
    const [ otherSubjects, setOtherSubjects ] = useState(undefined);

    const [ loadingClassSubjects, setLoadingClassSubjects ] = useState(true);
    const [ loadingOtherSubjects, setLoadingOtherSubjects ] = useState(true);

    document.title = `ELSYS Helper | ${name} | Предмети`;

    // GETTING THE CURRENT'S CLASS DETAILS
    useEffect(() => {
        api_get(`/classes/${name}`)
            .then((response) => {setClass(response)})
            .catch((error) => {
                if (error.detail !== undefined) {
                    toast.error(error.detail);
                    navigate('/classes');
                } else {
                    toast.error(error.message);
                }
            })

        api_get(`/classes/${name}/subjects`)
            .then((response) => {setClassSubjects(response)})
            .catch((error) => {
                if (error.detail !== undefined) {
                    toast.error(error.detail);
                } else {
                    toast.error(error.message);
                }
            })
            .finally(() => {setLoadingClassSubjects(false)})

        api_get(`/subjects`)
            .then((response) => {setOtherSubjects(response)})
            .catch((error) => {
                if (error.detail !== undefined) {
                    toast.error(error.detail);
                } else {
                    toast.error(error.message);
                }
            })
            .finally(() => {setLoadingOtherSubjects(false)})
    }, [name, navigate])

    const addSubject = (subject) => {
        api_post(`/classes/${name}/subjects/add`,{"name": subject.name})
            .then(() => {
                toast.success(`Предмет '${subject.name}' беше успешно добавен на Клас ${name}.`);
                setClassSubjects([...classSubjects, subject]);
            })
            .catch((error) => {
                if (error.detail !== undefined) {
                    toast.error(error.detail);
                } else {
                    toast.error(error.message);
                }
            })
    }

    const removeSubject = (subject) => {
        api_delete(`/classes/${name}/subjects/remove`,{"name": subject.name})
            .then(() => {
                toast.success(`Предмет '${subject.name}' беше успешно премахнат от Клас ${name}.`);
                const newClassSubjects = [...classSubjects];
                classSubjects.map((classSubject, index) => {
                    if (classSubject.name === subject.name) {
                        newClassSubjects.splice(index, 1);
                    }
                })
                setClassSubjects(newClassSubjects);
                console.log(classSubjects)
            })
            .catch((error) => {
                if (error.detail !== undefined) {
                    toast.error(error.detail);
                } else {
                    toast.error(error.message);
                }
            })
    }

    const checkClassHasSubject = (subjects, subject) => {
        let flag = false;
        subjects.forEach((subjectInJson) => {
            if (subjectInJson.name === subject.name) {
                flag = true;
            }
        })
        return flag;
    }

    return (
        <>
            <Container>
                <Row className={'justify-content-center'}>
                    <Col lg={6}>
                        <h1 className="text-center mb-5">'{name}' клас - Предмети</h1>
                    </Col>
                    <Col lg={10}>
                        {classSubjects === undefined || otherSubjects === undefined ?
                            <div className={'text-center'}>
                                <Loading error={!loadingClassSubjects + !loadingOtherSubjects}/>
                            </div>
                            :
                            <Table striped bordered hover responsive className="mb-5">
                                <thead>
                                <tr>
                                    <th>Предмет</th>
                                    <th>Действие</th>
                                </tr>
                                </thead>
                                <tbody>
                                {otherSubjects.map((subject, index) => (
                                        <tr key={index} className="text-center">
                                            <td>{subject.name}</td>
                                            <td>
                                                {checkClassHasSubject(classSubjects, subject) === true ?
                                                    <Button onClick={() => {removeSubject(subject)}} variant={"danger"}>Премахни</Button>
                                                    :
                                                    <Button onClick={() => {addSubject(subject)}} variant={"success"}>Добави</Button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                                </tbody>
                            </Table>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Class;