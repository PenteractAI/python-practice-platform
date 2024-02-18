<script>
    import { userUuid } from "../stores/stores.js";
    import { score } from "../stores/score.js";
    import { onDestroy, onMount } from "svelte";
    import { currentAssignment } from "../stores/currentAssignment.js";
    import CodeEditor from "./Assignment/CodeEditor.svelte";
    import Status from "./Assignment/Status.svelte";
    import GradingButton from "./Assignment/GradingButton.svelte";
    import Title from "./Assignment/Title.svelte";
    import Handout from "./Assignment/Handout.svelte";
    import NextAssignmentButton from "./Assignment/NextAssignmentButton.svelte";
    import FeedbackList from "./Assignment/FeedbackList.svelte";

    // WebSocket connection
    let ws;

    // Assignment variables
    let { id, assignmentOrder, handout, title, submissions } = $currentAssignment;
    let code = submissions.length > 0 ? submissions[0].code : '';
    let lastSubmissionId = submissions.length > 0 ? submissions[0].id : 0;

    $: ({ id, assignmentOrder, handout, title, submissions} = $currentAssignment)
    $: isGrading = submissions.length > 0 && submissions[0].status === 'pending';
    $: isSuccessful = submissions.length > 0 && submissions[0].correct;

    /**
     * On component mount, retrieves the status of a submission
     * if the submission is grading.
     */
    onMount(() => {
        if(isGrading) {
            getSubmissionStatus();
        }
    });

    onDestroy(() => {
        if(ws) {
            ws.onclose();
        }
    })

    /**
     * Retrieves the status of a submission.
     *
     * @async
     * @function getSubmissionStatus
     * @returns {Promise<void>}
     */
    const getSubmissionStatus = async () => {
        const host = window.location.hostname;
        ws = new WebSocket(`ws://${host}:7800/api/submission`);

        ws.onopen = () => {
            console.log('WebSocket is opened.');

            ws.send(JSON.stringify({
                lastSubmissionId: lastSubmissionId,
                userUuid: $userUuid
            }));
        }

        ws.onmessage = async (message) => {
            console.log('Message received.');

            const newSubmission = JSON.parse(message.data);
            submissions = [newSubmission, ...submissions];

            isSuccessful = newSubmission.correct;

            document.body.classList.add('ready-for-testing');

            ws.close();
        }

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);

            isGrading = false;

        };

        ws.onclose = (event) => {
            console.log('WebSocket is closed now.', event);

            if(isSuccessful) {
                score.loadScore($userUuid);
            }

            isGrading = false;
        };
    };

    /**
     * Sends a grading request for a given assignment.
     *
     * @async
     * @function sendGradingRequest
     * @returns {void}
     */
    let sendGradingRequest = async () => {
        isGrading = true;

        const data = {
            userUuid: $userUuid,
            assignmentId: id,
            code: code,
        };

        const response = await fetch("/api/grade", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if(response.status === 400) {
            alert(await response.text());
            isGrading = false;
        } else {
            const jsonData = await response.json();
            lastSubmissionId = jsonData.id;

            getSubmissionStatus();
        }
    };

</script>

<section class="flex h-screen w-full">
    <CodeEditor bind:code/>
    <div class="fixed top-20 right-10 bottom-10 z-20 flex flex-col space-y-4 w-80">
        <div class="flex items-end justify-end">
            <Title title={title} assignmentOrder={assignmentOrder}/>
        </div>
        <Handout handout={handout} />
        <div class="flex flex-row gap-5">
            <GradingButton bind:isGrading sendGradingRequest={sendGradingRequest}/>
            {#if isSuccessful}
                <NextAssignmentButton />
            {/if}
        </div>
        <Status bind:submissions bind:isGrading bind:isSuccessful/>
        <FeedbackList submissions={submissions} />
    </div>
</section>