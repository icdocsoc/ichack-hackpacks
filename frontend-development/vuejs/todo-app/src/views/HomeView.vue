<script lang="ts">
import Task from "../components/Task.vue"

export default {
  components: {
    Task
  },
  data() {
    return {
      tasks: [
        { id: 0, name: "The Night Circus", description: "(Erin Morgenstern)" },
        { id: 1, name: "The Starless Sea", description: "(Erin Morgenstern)" },
        { id: 2, name: "The Ten Thousand Doors of January", description: "(Alix E. Harrow)" },
        { id: 3, name: "The Girl with the Dragon Tattoo", description: "(Stieg Larsson)" },
      ],
      new_open: false,
      new_name: "",
      new_description: "",
      form_invalid: false,
      last_used_id: 3,
    }
  },

  methods: {
    open_modal() {
      this.new_name = "";
      this.new_description = "";
      this.form_invalid = false;
      this.new_open = true;
    },
    submit_task() {
      if (this.new_name == "") {
        this.form_invalid = true;
      } else {
        this.new_open = false;
        this.tasks.push({ id: ++this.last_used_id, name: this.new_name, description: this.new_description })
      }
    },
    cancel_task() {
      this.new_open = false;
    },
    complete_task(task_id: number) {
      let idx = this.tasks.findIndex(({ id }) => id == task_id)
      this.tasks.splice(idx, 1)
    }
  }
}
</script>

<template>
  <button class="box" id="new_task" v-on:click="open_modal">New Task</button>
  <Task v-for="task in tasks" v-on:task_completed="complete_task(task.id)" v-bind:name="task.name"
    v-bind:description="task.description" />
  <Teleport to="body" v-if="new_open">
    <div class="modal-bg" />
    <div class="modal box">
      <h4 class="padded with-margin">Add Task</h4>
      <input class="box" v-model="new_name" placeholder="Name" /><br />
      <input class="box" v-model="new_description" placeholder="Description" /><br />
      <p class="with-margin" v-if="form_invalid">Invalid Submission!</p>
      <button class="box" v-on:click="submit_task">Submit</button>
      <button class="box" v-on:click="cancel_task">Cancel</button>
    </div>
  </Teleport>
</template>

<style scoped>
h4 {
  padding: 5px;
  margin: 5px;
}
</style>
