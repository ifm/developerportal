# Data recording with ifmVisionAssistant

Throughout the stages of integration, development, and testing of the PDS solution, there might be instances where issues arise. In such cases, the first course of action should be to record the relevant data and document the issue for further examination.

The user can record 2 types of data: "normal" data (distance, amplitude, etc) and algo-debug data. The "normal" data can be used in user-specific algorithms. However, it is not sufficient for ifm to improve or verify the ifm applications, filters, etc.

Algo-debug records all necessary data for ifm to re-simulate the event as it occurred during live operation. This includes the “normal” ifm data streams and additional information from applications that might be protected because they are considered the intellectual property of ifm. 
This data is used to replay scenarios and reevaluate algorithmic approaches. 
Without this data, it is not possible to perform an in-depth analysis of the issue.

To record PDS data, navigate to the `Monitor` window and click on `Recording` in the bottom toolbar. There are two buttons beside the `Start/Stop` button which toggle the option to record `algo-debug` data and to include `point cloud` data.

1. Set the application state to `IDLE` before recording the data in the `Application` window.
2. Navigate to `Monitor` window and open the `Recording` tab under the display window.
3. Toggle the `algo-debug` data button. Only `algo-debug` data is useful for debugging by the developers at ifm. 
4. Select the duration.
5. Start the recording.
6. Parametrize and trigger the desired PDS command. Note that you cannot view the result after triggering the command in the display window and the command returns to `nop` after processed. Make sure you allow enough time for processing the first command before triggering it again (around 0.5 second).
7. Trigger the command several times to gather more data.
8. Stop the recording, if you didn't select the continuous recording.

![Recording iVA](resources/record.png)

