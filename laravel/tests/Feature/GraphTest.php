<?php

namespace Tests\Feature;

use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Models\Subject;

class GraphTest extends TestCase
{
    /**
     * Create subject model and test graphql.
     *
     * @return void
     */

    public function test_create_query_destroy_subject(): void
    {
        $user = User::factory()->make();

        Sanctum::actingAs(
            $user,
        );

        $subject = Subject::factory()->create();
        // $this->testUserId = $subject->id;
        $response = $this->graphQL(/** @lang GraphQL */ '
            {
                subject(id: '.$subject->id.') {
                    name
                }
            }
        ')->assertJson([
            'data' => [
                'subject' => [
                    'name' => $subject->name,
                ],
            ],
        ]);

        $response = $this->graphQL(/** @lang GraphQL */ '
            mutation {
                deleteSubject(id: '.$subject->id.') {
                    name
                }
            }
        ')->assertJson([
            'data' => [
                'deleteSubject' => [
                    'name' => $subject->name,
                ],
            ],
        ]);
    }

    /**
     * Try to query Users, be rejected.
     *
     * @return void
     */

    public function testQueryUsersProtected(): void
    {
        $response = $this->graphQL(/** @lang GraphQL */ '
            {
                users {
                    data {
                        name
                    }
                }
            }
        ')->decodeResponseJson();

        $message = array_shift(json_decode($response->json)->errors)->message;
        $this->assertEquals($message, "Unauthenticated.");
    }

    /**
     * Try to query Users as authenticated user, be successful.
     *
     * @return void
     */

    public function testQueryUsersAuthenticated(): void
    {
        $user = User::factory()->make();

        Sanctum::actingAs(
            $user,
        );

        $response = $this->graphQL(/** @lang GraphQL */ '
            {
                users {
                    data {
                        name
                    }
                }
            }
        ')->decodeResponseJson();

        $users = json_decode($response->json)->data->users->data;
        $this->assertCount(1, $users);
    }

    /**
     * Try to query Users as authenticated user, be successful.
     *
     * @return void
     */

    public function testQueryCreateSubject(): void
    {
        $user = User::factory()->make();

        Sanctum::actingAs(
            $user,
        );

        $response = $this->graphQL(/** @lang GraphQL */ '
            mutation {
                upsertSubject(
                    name: "Test A",
                    date_of_birth: "1990-10-13",
                    test_chamber: 1,
                    score: 22,
                    alive: true) {
                    id
                    name
                    date_of_birth
                    test_chamber
                    score
                    alive
                    created_at
                }
            }
        ')->decodeResponseJson();

        $subject = json_decode($response->json)->data->upsertSubject;
        $this->assertEquals("Test A", $subject->name);
    }
}
