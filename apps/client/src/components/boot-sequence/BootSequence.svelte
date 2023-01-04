<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { createEventDispatcher } from 'svelte';
    import { actionList } from './action-list';
    import { subjectList } from './subject-list';
    import { resultList } from './result-list';

	const dispatch = createEventDispatcher();

	let taskList: Array<{ message: string; isFailed: boolean }> = [];
    let taskListWrapper: HTMLDivElement;
    let scrollTop = 0;
    const numTasks = 120;
    const taskSpeed = 1;

    const getRandomIndexOfArray = (arrayLenght: number) => {
        return Math.floor(Math.random() * Math.floor(arrayLenght));
    }

    const createTask = () => {
        const action = actionList[getRandomIndexOfArray(actionList.length)];
        const subject = subjectList[getRandomIndexOfArray(subjectList.length)];
        const resultIndex = getRandomIndexOfArray(resultList.length);
        const result = resultList[resultIndex];
        const message = `${action} ${subject}: ${result}`;
        return {
            message,
            isFailed: resultIndex > 7,
        }
    }

    const fakeWorkload = async () => {
        let timeoutTime = Math.random()*100*taskSpeed;
        if (taskList.length % 10) {
            timeoutTime = timeoutTime / (taskList.length / 10);
        } else {
            timeoutTime = timeoutTime * (taskList.length / 10);
        }
        return new Promise((res) => setTimeout(res, timeoutTime));
    }
    const runTasks = async () => {
        taskList.push(createTask());
        taskList = taskList;
        scrollTop = taskListWrapper.scrollHeight;
        if (taskList.length >= numTasks)
            return setTimeout(() => dispatch('ready'), 100);
        await fakeWorkload();
        return runTasks();
    }
    onMount(() => runTasks());
    afterUpdate(() => {
		taskListWrapper.scrollTop = scrollTop;
	});
</script>

<div class="boot" bind:this={taskListWrapper}>
    <div class="head">
        Welcome to mOS 2022v1
        <br />
        Copyright (C) Marc Roemmelt
        <br />
        /home/marc_
    </div>
    <div class="list">
        {#each taskList as task}
            <p>[<span class="success-flag" class:success={!task.isFailed} class:failed={task.isFailed}>{task.isFailed ? 'FAILED' : 'OK'}</span>]<span class="message" class:msg-failed={task.isFailed}>{task.message}</span></p>
        {/each}
    </div>
    <div class="caret-container"><div class="caret"></div></div>
</div>

<style>
	.boot {
        width: 100%;
        height: 100%;
        background: black;
        color: white;
        overflow: auto;
    }
    .head {
        padding: 40px 0px 0px 40px;
        height: 80px;
        text-transform: none;
        letter-spacing: 0;
        padding-top: 30px;
        text-align: left;
        font-weight: 200;
    }
    .list {
        padding: 40px 0px 0px 40px;
        text-transform: uppercase;
    }
    p {
        display: flex;
        margin: 0;

        text-align: left;
    }
    .success-flag {
        display: flex;
        justify-content: center;
        width: 65px;
    }
    .failed {
        color: red;
    }
    .success {
        color: green;
    }
    .message {
        margin-left: 1em;
    }
    .msg-failed {
        color: yellow;
    }

    .caret-container {
        padding: 10px 0px 40px 40px;
    }
    .caret {
        width: 10px;
        height: 20px;
        background-color: white;
        animation: caretBlinker 800ms steps(2, start) infinite;
    }

    @keyframes caretBlinker {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        51% {
            opacity: 1;
        }
        100% {
            opacity: 1;
        }
    }
</style>
