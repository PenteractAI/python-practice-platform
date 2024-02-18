<script>
    export let submissions;
    export let isGrading;
    export let isSuccessful;

    const commonClasses = " text-center items-center px-2 py-1 text-sm font-ubuntu font-medium ring-1 ring-inset "
    let text = ""
    let classes = "";

    const setClasses = () => {
        if (!isGrading && submissions.length === 0) {
            text = "Not submitted";
            classes = "bg-gray-100 text-gray-700 ring-gray-700"
        } else {
            let lastSubmission = submissions[0];
            if (isGrading || lastSubmission.status == 'pending') {
                text = "Pending";
                classes = "bg-starship-100 text-starship-700 ring-starship-700"
            } else if (!isSuccessful) {
                text = "Failed";
                classes = "bg-cinnabar-100 text-cinnabar-700 ring-cinnabar-700"
            } else if (isSuccessful) {
                text = "Passed";
                classes = "bg-bright-green-100 text-bright-green-700 ring-bright-green-700"
            }
        }

        classes += commonClasses;
    }

    $: setClasses(), submissions, isGrading;
</script>

<span
        class={classes}
        data-testid="status-badge"
>{text}</span>