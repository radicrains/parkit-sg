import React, { useState } from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import './App.css';


const EditForm = (props) => {
	const [open, setOpen] = useState(false);
	const onOpenModal = () => setOpen(true);
	const onCloseModal = () => setOpen(false);

	const updateComment = (comment) => {
		console.log('before fetch,' + comment)
		fetch('/comments/' + comment._id, {
			body: JSON.stringify(comment),
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
            }
		})
        .then(response => response.json())
        .then((jsonedComment) => {
            console.log('Updated:', jsonedComment);
            fetch('/comments')
            .then(response => response.json())
            .then((jsonedComment) => {
                console.log(jsonedComment)
                props.onUpdateComments(jsonedComment);
            });
        })
		.catch(err => console.log(err));
	};

    const [comment, setComment] = useState(props.comment.comment);

	const handleSubmit = (event) => {
		event.preventDefault();
        console.log('handleSubmit ran...')
		updateComment({
            _id: props.comment._id,
            comment: comment,
        });
        // console.log(comment)
        // setComment('');
	};

	const handleChange = (event) => {
		setComment(event.target.value);
        // console.log(comment)
	};

	return (
		<div>
			<button className='btn' onClick={onOpenModal}>Edit</button>
			<Modal open={open} onClose={onCloseModal} center>
				
				<h4>Edit Your Comment</h4>
				<form onSubmit={handleSubmit}>
                    <label htmlFor="comment"></label>
                    <input type="text" id="comment" value={comment} onChange={handleChange}></input>
		        </form>
				
			</Modal>
		</div>
	);
};

export default EditForm;
