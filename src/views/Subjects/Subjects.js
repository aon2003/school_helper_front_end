import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {api_delete, api_get} from "../../utils/fetch";
import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faEdit, faExternalLink} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import {LinkContainer} from 'react-router-bootstrap';
import Loading from "../../components/Loading";
import {useNavigate} from "react-router";
import authContext from "../../utils/authContext";
import handleFetchError from "../../utils/handleFetchError";
import InfoAlert from "../../components/InfoAlert";
import Title from "../../components/Title";

const Subjects = () => {

    document.title = "ELSYS Helper | Предмети";

    const [subjects, setSubjects] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const Auth = useContext(authContext);

    useEffect(() => {
        if (!Auth.auth) {
            toast.error('За да достъпите тази страница трябва да влезете в Профила си!');
            navigate('/login');
        }

        api_get("/subjects", Auth.token)
            .then(response => setSubjects(response))
            .catch(handleFetchError)
            .finally(() => setLoading(false));
    }, [Auth.auth, Auth.token, navigate])

    const deleteSubject = (name, index) => {
        api_delete("/subjects/" + name + "/delete", null, Auth.token)
            .then(() => {
                toast.success("Предметът '"+ name +"' беше успешно изтрит.")
                const new_list = [...subjects];
                new_list.splice(index, 1);
                setSubjects(new_list);
            })
            .catch(handleFetchError)
    }

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Title text={`Предмети`} className={'mb-4'}/>

                        <div className="d-flex justify-content-end mb-3">
                            <LinkContainer to={"/subjects/create"}>
                                <Button variant="outline-primary" className={'rounded-mine shadow-mine'}>Добави Предмет</Button>
                            </LinkContainer>
                        </div>

                        { subjects === undefined ?
                            <Loading error={!loading}/>
                            :
                            <>
                                {
                                    subjects.length === 0 ?
                                        <InfoAlert text={'Няма създадени Предмети!'}/>
                                        :
                                        <Table striped borderless hover className="mb-5 shadow-mine rounded-mine">
                                            <thead>
                                            <tr>
                                                <th>Предмет</th>
                                                <th>Действия</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {subjects.map((subject, index) => (
                                                    <tr key={index} className="text-center">
                                                        <td>{subject.name}</td>
                                                        <td>
                                                            <LinkContainer to={`${subject.name}`}>
                                                                <Button disabled variant={"success"} className="m-1">
                                                                    <FontAwesomeIcon icon={faExternalLink} />
                                                                </Button>
                                                            </LinkContainer>
                                                            <LinkContainer to={`${subject.name}/edit`}>
                                                                <Button variant={"warning"} className="m-1">
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                            </LinkContainer>
                                                            <Button onClick={() => deleteSubject(subject.name, index)} variant={"danger"} className="m-1">
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                            </tbody>
                                        </Table>
                                }
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Subjects;
