import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from "@material-ui/core/styles";
import { BASE_URL } from '../../common/constants';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        paddingTop: 15,
        marginTop: 15,
        marginBottom: 5,
        paddingBottom: 5,
    },

    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginLeft: 55,
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export default function DragNDrop(props) {
    const classes = useStyles();

    const getItemStyle = (draggableStyle) => ({
        ...draggableStyle,
    });

    return (<>

        <DragDropContext onDragEnd={props.onDragEnd}>
            <Droppable droppableId="list">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>

                        {props.list?.map((containerItem, containerIndex) => (

                            <Draggable key={containerItem?.funncar?._id} draggableId={containerItem?.funncar?._id} index={containerIndex}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            provided.draggableProps.style,
                                        )}
                                    >
                                        <Card className={classes.root} >
                                            <CardHeader className="cardFuncar"
                                                avatar={
                                                    !containerItem?.funncar?.profileImage ? <Avatar variant="square" className={classes.large}>{containerItem?.funncar?.professionalName?.charAt(0).toUpperCase()}</Avatar> :
                                                        <Avatar alt="funncar" variant="square" className={classes.large} src={`${BASE_URL}/${containerItem?.funncar?.profileImage}`} />

                                                }

                                                title={<><span>{containerItem?.funncar?.professionalName}</span><br/>
                                                <p className="m-0 p-0">{containerItem?.funncar?.mainCategory?.name}</p></>}
                                                
                                                // subheader={containerItem?.funncar?.mainCategory?.name}
                                                subheader={
                                                    <Rating name="read-only" precision={0.5} value={containerItem?.funncar?.averageRating} size="small" readOnly />
                                                }
                                            />
                                            <CardContent className="cardContent1">
                                                <Typography className={classes.pos} style={{ float:'right', marginRight:20  }} color="textSecondary">
                                                    Rs {containerItem?.funncar?.averageRate}
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                    </div>
                                )}
                            </Draggable>


                        ))}
                        {provided.placeholder}
                    </div>)}
            </Droppable>


        </DragDropContext>
    </>
    );
}


